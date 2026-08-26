import React from "react";
import PageTitleBanner from "@/components/common/PageTitleBanner";
import { Metadata } from "next";
import ContactCMS from "@/components/otherPages/ContactCMS";
import MapCMS from "@/components/otherPages/MapCMS";
import { ContactUsContent } from "@/types/contact-us";
import { getContactUsContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactUsContent();
  const title = content?.seo?.title || "Contact Us - Al Bahar & Partners - Technology Solutions";
  const description = content?.seo?.description || "Get in touch with Al Bahar & Partners. Reach out today to discuss how we can support your business goals.";
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

export default async function ContactUsPage() {
  const content = await getContactUsContent();

  // Fallback content if CMS data is not available
  const headerData = content?.header || {
    breadcrumb: "Contact Us",
    title: "Contact Us",
    subtitle: "Explore success stories from businesses that achieved growth through our tailored strategies and solutions.",
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
            <ContactCMS data={content} />
            <MapCMS data={content} />
          </>
        )}
      </div>
    </>
  );
}
