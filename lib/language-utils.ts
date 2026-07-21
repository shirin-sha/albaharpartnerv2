/**
 * Get current language from pathname
 */
export function getLanguageFromPathname(pathname: string | null): 'ltr' | 'rtl' {
  return pathname?.startsWith('/ar') ? 'rtl' : 'ltr';
}

/**
 * Add language prefix to a link based on current pathname
 * @param href - The original href (e.g., '/about-us', '/solutions')
 * @param currentPathname - Current pathname (e.g., '/', '/ar', '/ar/about-us')
 * @returns Language-prefixed href (e.g., '/about-us' or '/ar/about-us')
 */
export function addLanguagePrefix(href: string, currentPathname: string | null): string {
  if (!href || href.startsWith('http') || href.startsWith('#')) {
    return href; // External links or anchors stay as-is
  }

  const isRtl = currentPathname?.startsWith('/ar') || false;
  
  if (isRtl) {
    // If we're on RTL route, add /ar prefix
    if (href === '/') {
      return '/ar';
    }
    if (!href.startsWith('/ar')) {
      return `/ar${href}`;
    }
  } else {
    // If we're on LTR route, remove /ar prefix if present
    if (href.startsWith('/ar')) {
      return href.replace('/ar', '') || '/';
    }
  }
  
  return href;
}

/**
 * Remove language prefix from a pathname
 */
export function removeLanguagePrefix(pathname: string | null): string {
  if (!pathname) return '/';
  return pathname.replace(/^\/ar/, '') || '/';
}
