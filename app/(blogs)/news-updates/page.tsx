import React from "react";
import PageTitleBanner from "@/components/common/PageTitleBanner";
import { Metadata } from "next";
import NewsUpdatesCMS from "@/components/blogs/NewsUpdatesCMS";
import { getNewsUpdatesContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getNewsUpdatesContent();
  const title = content?.seo?.title || "News & Updates - Al bahar and partners";
  const description = content?.seo?.description || "Stay updated with insights, tips, and trends in finance and business strategy—curated by our experts to keep you informed and ahead.";
  const keywords = content?.seo?.keywords || [];
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
    },
  };
}

export const revalidate = 3600;

export default async function NewsUpdatesPage() {
  const content = await getNewsUpdatesContent();

  const headerData = content?.header || {
    breadcrumb: "News & Updates",
    title: "News & Updates",
    subtitle: "Stay updated with insights, tips, and trends in finance and business strategy—curated by our experts to keep you informed and ahead.",
    language: "ltr" as const,
    isActive: true,
  };

  return (
    <>
      {headerData.isActive && (
        <PageTitleBanner
          breadcrumb={headerData.breadcrumb}
          title={headerData.title}
          subtitle={headerData.subtitle}
          imagePath={headerData.imagePath}
          isActive={headerData.isActive}
        />
      )}
      <div className="main-content tf-spacing-2">
        {content && <NewsUpdatesCMS data={content} />}
      </div>
    </>
  );
}
