import React from "react";
import { Metadata } from "next";
import Breadcumb from "@/components/common/Breadcumb";
import AboutAlBaharCMS from "@/components/otherPages/AboutAlBaharCMS";
import VisionMissionValuesCMS from "@/components/otherPages/VisionMissionValuesCMS";
import HeritageCMS from "@/components/otherPages/HeritageCMS";
import AboutBPCCMS from "@/components/otherPages/AboutBPCCMS";
import HistoryCMS from "@/components/otherPages/HistoryCMS";
import FaqsCMS from "@/components/otherPages/FaqsCMS";
import { getAboutUsContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutUsContent();
  const title = content?.seo?.title || "About us || Al bahar and partners";
  const description = content?.seo?.description || "Al bahar and partners";
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

export default async function AboutUsPage() {
  const content = await getAboutUsContent();

  // Fallback content if CMS data is not available
  const headerData = content?.header || {
    breadcrumb: "About Us",
    title: "About Us",
    subtitle: "Discover our mission to empower clients with expert solutions for confident, sustainable growth and success.",
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
              <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle }} />
            </div>
          </div>
        </div>
      )}
      
      <div className="main-content">
        {content?.heritage && <HeritageCMS data={content.heritage} />}
        {content?.aboutAlBahar && <AboutAlBaharCMS data={content.aboutAlBahar} />}
        {content?.history && <HistoryCMS data={content.history} />}
        {content?.aboutBPC && <AboutBPCCMS data={content.aboutBPC} />}
        {content?.visionMissionValues && <VisionMissionValuesCMS data={content.visionMissionValues} />}
        {content?.faqs && <FaqsCMS data={content.faqs} />}
      </div>
    </>
  );
}
