import { prepareRichTextForDisplay } from "@/lib/rich-text-utils";

interface CmsRichTextProps {
  html: string;
  className?: string;
}

export default function CmsRichText({ html, className = "" }: CmsRichTextProps) {
  const content = prepareRichTextForDisplay(html);
  if (!content) return null;

  return (
    <div
      className={`cms-rich-text${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
