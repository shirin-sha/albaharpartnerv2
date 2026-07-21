import { NewsPost } from '@/types/news-updates';

/** Main image for listing cards and detail page hero — prefers main (`detailImagePath`), then featured (`imagePath`). */
export function newsMainImageSrc(post: Pick<NewsPost, 'detailImagePath' | 'imagePath'>): string {
  const main = post.detailImagePath?.trim();
  const featured = post.imagePath?.trim();
  return main || featured || '';
}
