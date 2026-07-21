import React from "react";
import Breadcumb from "@/components/common/Breadcumb";
import { Metadata } from "next";
import SupportServicesCMS from "@/components/otherPages/SupportServicesCMS";
import SupportContactCMS from "@/components/otherPages/SupportContactCMS";
import { SupportContent } from "@/types/support";
import { getSupportContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSupportContent();
  const title = content?.seo?.title || "Support - Al Bahar & Partners";
  const description = content?.seo?.description || "From incident resolution to preventive maintenance, our support teams keep your operations secure, stable, and always available.";
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

export default async function SupportPage() {
  const content = await getSupportContent();

  // Fallback content if CMS data is not available
  const headerData = content?.header || {
    breadcrumb: "Support",
    title: "Support",
    subtitle: "From incident resolution to preventive maintenance, our support teams keep your operations secure, stable, and always available.",
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
        {content && (
          <>
            <SupportServicesCMS data={content} />
            <SupportContactCMS data={content} />
          </>
        )}
      </div>
    </>
  );
}


















