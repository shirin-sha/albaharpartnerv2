import React from "react";
import PageTitleBanner from "@/components/common/PageTitleBanner";
import { Metadata } from "next";
import CustomerStoriesCMS from "@/components/case-studies/CustomerStoriesCMS";
import { CustomerStoriesContent } from "@/types/customer-stories";
import { getCustomerStoriesContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCustomerStoriesContent();
  const title = content?.seo?.title || "Customer Stories - Al bahar and partners";
  const description = content?.seo?.description || "See how Al Bahar & Partners helps organizations strengthen security, improve visibility, and modernize IT through proven technology deployments.";
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

export default async function CustomerStoriesPage() {
  const content = await getCustomerStoriesContent();

  // Fallback content if CMS data is not available
  const headerData = content?.header || {
    breadcrumb: "Customer Stories",
    title: "Customer Stories",
    subtitle: "See how Al Bahar & Partners helps organizations strengthen security, improve visibility, and modernize IT through proven technology deployments.",
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
        {content && <CustomerStoriesCMS data={content} />}
      </div>
    </>
  );
}
