import React from "react";
import { Metadata } from "next";
import { getNewsUpdatesContent } from "@/lib/data-fetch";
import { resolvePostById } from "@/lib/news-post-resolve";
import NewsPostDetailView, { NewsPostNotFound } from "@/components/blogs/NewsPostDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const title = "News & Updates || Al Bahar & Partners";
  return {
    title,
    description: "Al Bahar & Partners",
    openGraph: {
      title,
      description: "Al Bahar & Partners",
      type: "article",
      url: `/news-updates/${id}`,
    },
  };
}

export default async function NewsDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const content = await getNewsUpdatesContent("ltr");
  const post = resolvePostById(id, content?.posts || []);
  const activePosts = (content?.posts || []).filter((p) => p.isActive);
  const header = content?.header;

  if (!post) {
    return (
      <NewsPostNotFound
        backHref="/news-updates"
        notFoundTitle="News post not found"
        notFoundCta="Back to News"
      />
    );
  }

  return (
    <NewsPostDetailView
      post={post}
      activePosts={activePosts}
      postsPathPrefix="/news-updates"
      breadcrumbPageName={header?.breadcrumb || "News & Updates"}
      listingTitle={header?.title || "News & Updates"}
      recentPostsTitle="Recent posts"
      language="ltr"
    />
  );
}
