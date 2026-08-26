import React from "react";
import PageTitleBanner from "@/components/common/PageTitleBanner";
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
        <PageTitleBanner
          breadcrumb={headerData.breadcrumb}
          title={headerData.title}
          subtitle={headerData.subtitle}
          imagePath={headerData.imagePath}
          isActive={headerData.isActive}
        />
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


















