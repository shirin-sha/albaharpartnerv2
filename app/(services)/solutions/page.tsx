import ServicesCMS from "@/components/services/ServicesCMS";
import React from "react";
import Breadcumb from "@/components/common/Breadcumb";
import { Metadata } from "next";
import { SolutionsContent } from "@/types/solutions";
import { getSolutionsContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSolutionsContent();
  const title = content?.seo?.title || "Solutions";
  const description = content?.seo?.description || "Our comprehensive solutions for your business needs";
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

export default async function SolutionsPage() {
  const content = await getSolutionsContent();

  // Fallback content if CMS data is not available
  const headerData = content?.header || {
    breadcrumb: "Solutions",
    title: "Solutions",
    subtitle: "",
    language: "ltr" as const,
    isActive: true,
  };

  return (
    <>
      {headerData.isActive && (
        <div className="page-title style-1 bg-img-8">
          <div className="tf-container">
            <div className="page-title-content">
              <Breadcumb pageName={headerData.breadcrumb} />
              <h2 className="title-page-title">{headerData.title}</h2>
              {headerData.subtitle && (
                <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle }} />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="main-content">
        {content && <ServicesCMS data={content} />}
        {/* <Process />
        <Features />
        <Cta /> */}
      </div>
    </>
  );
}


















