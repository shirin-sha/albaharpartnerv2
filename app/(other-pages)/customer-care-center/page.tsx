import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import Breadcumb from "@/components/common/Breadcumb";
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
  const header = content?.header;

  return (
    <>
      {header?.isActive !== false && (
        <div className="ccc-hero">
          {header?.imagePath && (
            <Image
              src={header.imagePath}
              alt={header.title || "Customer Care Center"}
              fill
              priority
              quality={75}
              sizes="100vw"
              className="ccc-hero-image"
              style={{ objectFit: "cover" }}
            />
          )}
          <div className="ccc-hero-overlay" aria-hidden="true" />
          <div className="tf-container ccc-hero-inner">
            <div className="ccc-hero-content">
              <Breadcumb pageName={header?.breadcrumb || "Customer Care Center"} />
              {header?.tag && (
                <span className="ccc-hero-tag text-btn-uppercase">{header.tag}</span>
              )}
              <h1 className="ccc-hero-title">
                {header?.title || "Al-Bahar Customer Care Center"}
              </h1>
              {header?.subtitle && (
                <p className="ccc-hero-subtitle body-2">{header.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
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
