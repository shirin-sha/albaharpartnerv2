import ServicesCMS from "@/components/services/ServicesCMS";
import React from "react";
import PageTitleBanner from "@/components/common/PageTitleBanner";
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
        <PageTitleBanner
          breadcrumb={headerData.breadcrumb}
          title={headerData.title}
          subtitle={headerData.subtitle}
          imagePath={headerData.imagePath}
          isActive={headerData.isActive}
        />
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


















