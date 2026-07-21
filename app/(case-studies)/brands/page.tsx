import React from "react";
import Breadcumb from "@/components/common/Breadcumb";
import { Metadata } from "next";
import BrandsCMS from "@/components/case-studies/BrandsCMS";
import { BrandsContent } from "@/types/brands";
import { getBrandsContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getBrandsContent();
  const title = content?.seo?.title || "Brands - Al bahar and partners";
  const description = content?.seo?.description || "Our trusted partner brands";
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

export default async function BrandsPage() {
  const content = await getBrandsContent();

  // Fallback content if CMS data is not available
  const headerData = content?.header || {
    breadcrumb: "Brands",
    title: "Brands",
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
        {content && <BrandsCMS data={content} />}
      </div>
    </>
  );
}
