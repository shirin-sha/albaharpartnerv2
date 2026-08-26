import React from "react";
import PageTitleBanner from "@/components/common/PageTitleBanner";
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
        <PageTitleBanner
          breadcrumb={headerData.breadcrumb}
          title={headerData.title}
          subtitle={headerData.subtitle}
          imagePath={headerData.imagePath}
          isActive={headerData.isActive}
        />
      )}
      <div className="main-content">
        {content && <BrandsCMS data={content} />}
      </div>
    </>
  );
}
