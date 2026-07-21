import React from "react";
import Breadcumb from "@/components/common/Breadcumb";
import { Metadata } from "next";
import NewsUpdatesCMS from "@/components/blogs/NewsUpdatesCMS";
import { NewsUpdatesContent } from "@/types/news-updates";
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

// Static generation with on-demand revalidation (triggered from admin panel)
// Pages are pre-generated at build time and regenerate when admin updates content via revalidatePath
// Using ISR with long revalidate time - pages stay static until admin triggers regeneration
export const revalidate = 3600; // ISR: Regenerates after 1 hour OR immediately when admin calls revalidatePath

export default async function NewsUpdatesPage() {
  const content = await getNewsUpdatesContent();

  // Fallback content if CMS data is not available
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
        <div className="page-title style-1 bg-img-8">
          <div className="tf-container">
            <div className="row">
              <div className="col-12">
                <div className="page-title-content">
                  <Breadcumb pageName={headerData.breadcrumb} />
                  <h2 className="title-page-title">{headerData.title}</h2>
                  {headerData.subtitle && (
                    <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle.replace(/\n/g, '<br />') }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="main-content tf-spacing-2">
        {content && <NewsUpdatesCMS data={content} />}
      </div>
    </>
  );
}


















