import type { NewsPost } from "@/types/news-updates";

export function resolvePostById(id: string, posts: NewsPost[]): NewsPost | null {
  const activePosts = posts.filter((p) => p.isActive);
  if (activePosts.length === 0) return null;

  const byObjectId = activePosts.find((p) => String(p._id || "") === id);
  if (byObjectId) return byObjectId;

  const numericId = Number(id);
  if (Number.isInteger(numericId) && numericId > 0 && numericId <= activePosts.length) {
    return activePosts[numericId - 1];
  }

  return null;
}
