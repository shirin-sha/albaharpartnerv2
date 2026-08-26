import React from "react";
import PageTitleBanner from "@/components/common/PageTitleBanner";
import { Metadata } from "next";
import CareerCMS from "@/components/otherPages/CareerCMS";
import { CareersContent } from "@/types/careers";
import { getCareersContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCareersContent();
  const title = content?.seo?.title || "Careers - Al bahar and partners";
  const description = content?.seo?.description || "Join our team of industry experts and make a meaningful impact. Discover opportunities to grow your career with us in a dynamic & rewarding environment.";
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

export default async function CareersPage() {
  const content = await getCareersContent();

  // Fallback content if CMS data is not available
  const headerData = content?.header || {
    breadcrumb: "Careers",
    title: "Careers",
    subtitle: "Join our team of industry experts and make a meaningful impact. Discover opportunities to grow your career with us in a dynamic & rewarding environment.",
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
        {content && <CareerCMS data={content} />}
      </div>
    </>
  );
}
