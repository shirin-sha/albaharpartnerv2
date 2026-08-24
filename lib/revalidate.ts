/**
 * Utility function to trigger on-demand revalidation
 * Call this after updating content in admin panel
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || '';

/**
 * Revalidate a specific page path
 */
export async function revalidatePage(path: string): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL('/api/revalidate', baseUrl);
    url.searchParams.set('path', path);
    
    if (REVALIDATE_SECRET) {
      url.searchParams.set('secret', REVALIDATE_SECRET);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to revalidate ${path}:`, response.status, response.statusText);
      return false;
    }

    const result = await response.json();
    console.log(`Successfully revalidated ${path}`);
    return result.revalidated === true;
  } catch (error) {
    console.error(`Error revalidating ${path}:`, error);
    return false;
  }
}

/**
 * Revalidate multiple pages at once
 */
export async function revalidatePages(paths: string[]): Promise<void> {
  await Promise.all(paths.map(path => revalidatePage(path)));
}

/**
 * Revalidate pages based on content type
 */
export async function revalidateByContentType(contentType: string): Promise<void> {
  const pathMap: Record<string, string[]> = {
    homepage: ['/'],
    header: ['/'], // Header affects homepage
    footer: ['/'], // Footer affects homepage
    'news-updates': ['/', '/news-updates'],
    'customer-stories': ['/', '/customer-stories'],
    solutions: ['/', '/solutions'],
    aboutus: ['/about-us'],
    'contact-us': ['/contact-us'],
    support: ['/support'],
    'customer-care-center': ['/customer-care-center', '/ar/customer-care-center'],
    careers: ['/career'],
    brands: ['/brands'],
  };

  const paths = pathMap[contentType] || [];
  if (paths.length > 0) {
    await revalidatePages(paths);
  }
}
