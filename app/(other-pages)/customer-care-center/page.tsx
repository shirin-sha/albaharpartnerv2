import React from "react";
import { Metadata } from "next";
import PageTitleBanner from "@/components/common/PageTitleBanner";
import CustomerCareCMS from "@/components/otherPages/CustomerCareCMS";
import { getCustomerCareContent } from "@/lib/data-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCustomerCareContent("ltr");
  const title =
    content?.seo?.title || "Customer Care Center - Al Bahar & Partners";
  const description =
    content?.seo?.description ||
    "Dedicated support for your BPC solutions: fast, reliable and always by your side.";
  const keywords = content?.seo?.keywords || [];

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export const revalidate = 3600;

export default async function CustomerCareCenterPage() {
  const content = await getCustomerCareContent("ltr");
  const headerData = content?.header || {
    breadcrumb: "Customer Care Center",
    title: "Al-Bahar Customer Care Center",
    subtitle:
      "Dedicated support for your BPC solutions: fast, reliable and always by your side.",
    imagePath: "",
    isActive: true,
  };

  return (
    <>
      <PageTitleBanner
        breadcrumb={headerData.breadcrumb}
        title={headerData.title}
        subtitle={headerData.subtitle}
        imagePath={headerData.imagePath}
        isActive={headerData.isActive !== false}
      />
      <div className="main-content">
        {content ? (
          <CustomerCareCMS data={content} language="ltr" />
        ) : (
          <div className="tf-container tf-spacing-2">
            <p>Customer Care Center content is not available yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
