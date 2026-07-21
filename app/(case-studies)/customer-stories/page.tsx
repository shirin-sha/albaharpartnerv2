import React from "react";
import Breadcumb from "@/components/common/Breadcumb";
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
        <div className="page-title style-1 bg-img-8">
          <div className="tf-container">
            <div className="page-title-content">
              <Breadcumb pageName={headerData.breadcrumb} />
              <h2 className="title-page-title">{headerData.title}</h2>
              {headerData.subtitle && (
                <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle.replace(/\n/g, '<br />') }} />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="main-content">
        {content && <CustomerStoriesCMS data={content} />}
      </div>
    </>
  );
}
