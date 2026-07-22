/**
 * Converts legacy plain-text CMS content to HTML when no tags are present.
 * Single line breaks (textarea soft-wrap) become spaces, not hard breaks.
 */
export function normalizeRichTextContent(content: string): string {
  const trimmed = content?.trim() ?? '';
  if (!trimmed) return '';
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;

  return trimmed
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}</p>`)
    .join('');
}

const PARA_MARKER = '|||PARA|||';

/**
 * Removes accidental hard line breaks from legacy textarea / contentEditable content
 * while preserving intentional paragraph splits (Enter key / double line break).
 */
export function cleanupRichTextHtml(html: string): string {
  const trimmed = html?.trim() ?? '';
  if (!trimmed) return '';

  if (/<(ul|ol|table)\b/i.test(trimmed)) {
    return trimmed.replace(/<br\s*\/?>(?!\s*<br)/gi, ' ');
  }

  let result = trimmed
    .replace(/<div>\s*<br>\s*<\/div>/gi, PARA_MARKER)
    .replace(/<\/div>\s*<div[^>]*>/gi, ' ')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '');

  result = result.replace(/<\/p>\s*<p[^>]*>/gi, PARA_MARKER);
  result = result.replace(/(<br\s*\/?>\s*){2,}/gi, PARA_MARKER);
  result = result.replace(/<br\s*\/?>/gi, ' ');

  const stripOuterP = (chunk: string) =>
    chunk.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '').trim();

  const parts = result
    .split(PARA_MARKER)
    .map(stripOuterP)
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    const single = stripOuterP(result.replace(/<\/?p[^>]*>/gi, '')).trim();
    return single ? `<p>${single}</p>` : '';
  }

  return parts.map((part) => `<p>${part}</p>`).join('');
}

/** Merge accidental div blocks created by legacy editors into one paragraph. */
export function mergeDivLinesToParagraph(html: string): string {
  if (!html?.trim()) return '<p><br></p>';
  if (/<(ul|ol|table)\b/i.test(html)) return html;

  const container = html.trim();
  const divPattern = /<div[^>]*>([\s\S]*?)<\/div>/gi;
  const divMatches = [...container.matchAll(divPattern)];

  if (divMatches.length > 1 && !/<\/p>\s*<p/i.test(container)) {
    const merged = divMatches
      .map((match) => match[1].replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join(' ');
    return merged ? `<p>${merged}</p>` : '<p><br></p>';
  }

  if (divMatches.length === 1 && !/<p[\s>]/i.test(container)) {
    const inner = divMatches[0][1].replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
    return inner ? `<p>${inner}</p>` : '<p><br></p>';
  }

  return container;
}

/** Convert heading tags and inline font sizes to normal paragraph text. */
export function normalizeRichTextTypography(html: string): string {
  if (!html?.trim()) return '';

  let result = html
    .replace(/<h([1-6])([^>]*)>/gi, '<p$2>')
    .replace(/<\/h[1-6]>/gi, '</p>')
    .replace(/<font[^>]*>/gi, '')
    .replace(/<\/font>/gi, '');

  result = result.replace(/\sstyle="([^"]*)"/gi, (_match, styles: string) => {
    const cleaned = styles
      .split(';')
      .map((rule) => rule.trim())
      .filter((rule) => rule && !/^font-size\s*:/i.test(rule) && !/^line-height\s*:/i.test(rule))
      .join('; ');

    return cleaned ? ` style="${cleaned}"` : '';
  });

  return result;
}

/** Normalize plain text and clean up legacy HTML line breaks. */
export function prepareRichTextContent(content: string): string {
  return normalizeRichTextTypography(
    mergeDivLinesToParagraph(cleanupRichTextHtml(normalizeRichTextContent(content))),
  );
}
