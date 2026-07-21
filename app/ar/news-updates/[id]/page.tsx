import React from "react";
import { Metadata } from "next";
import FooterCMS from "@/components/footers/FooterCMS";
import HeaderCMS from "@/components/headers/HeaderCMS";
import Header7 from "@/components/headers/Header7";
import { getHeaderContent, getFooterContent, getNewsUpdatesContent } from "@/lib/data-fetch";
import { resolvePostById } from "@/lib/news-post-resolve";
import NewsPostDetailView, { NewsPostNotFound } from "@/components/blogs/NewsPostDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const content = await getNewsUpdatesContent("rtl");
  const post = resolvePostById(id, content?.posts || []);
  const baseTitle = content?.seo?.title || content?.header?.title || "الأخبار والتحديثات";
  const title = post ? `${post.title} | ${baseTitle}` : `${baseTitle} | Al Bahar & Partners`;
  return {
    title,
    description: content?.seo?.description || "",
    openGraph: {
      title,
      description: content?.seo?.description || "Al Bahar & Partners",
      type: "article",
      url: `/ar/news-updates/${id}`,
    },
  };
}

export default async function ArabicNewsDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [headerContent, footerContent, content] = await Promise.all([
    getHeaderContent("rtl"),
    getFooterContent("rtl"),
    getNewsUpdatesContent("rtl"),
  ]);

  const post = resolvePostById(id, content?.posts || []);
  const activePosts = (content?.posts || []).filter((p) => p.isActive);
  const header = content?.header;

  let body: React.ReactNode;
  if (!post) {
    body = (
      <NewsPostNotFound
        backHref="/ar/news-updates"
        notFoundTitle="المقال غير موجود"
        notFoundCta="العودة إلى الأخبار"
      />
    );
  } else {
    body = (
      <NewsPostDetailView
        post={post}
        activePosts={activePosts}
        postsPathPrefix="/ar/news-updates"
        breadcrumbPageName={header?.breadcrumb || "الأخبار والتحديثات"}
        listingTitle={header?.title || "الأخبار والتحديثات"}
        recentPostsTitle="مقالات حديثة"
        language="rtl"
      />
    );
  }

  return (
    <>
      <div className="mb-20" />
      {headerContent ? <HeaderCMS data={headerContent} /> : <Header7 />}
      {body}
      {footerContent && <FooterCMS data={footerContent} />}
    </>
  );
}
