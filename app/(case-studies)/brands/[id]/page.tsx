import React from "react";
import Breadcumb from "@/components/common/Breadcumb";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandsContent } from "@/lib/data-fetch";
import BrandDetail from "@/components/case-studies/BrandDetail";
import { Brand } from "@/types/brands";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const content = await getBrandsContent();
  
  const brand = content?.brands?.find((b) => b._id === id);
  
  return {
    title: brand?.name
      ? `${brand.name} - Brands - Al bahar and partners`
      : "Brand Details - Al bahar and partners",
    description: `Learn more about ${brand?.name || "our partner brand"}`,
  };
}

// Helper function to create a slug from brand name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getBrandsContent();

  if (!content) {
    notFound();
  }

  // Try to find by _id first, then by slug
  const brand: Brand | undefined = content.brands?.find(
    (b) => b._id === id || createSlug(b.name) === id
  );

  if (!brand || !brand.isActive) {
    notFound();
  }

  const headerData = content?.header || {
    breadcrumb: "Brands",
    title: "Brands",
    subtitle: "",
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
              <h2 className="title-page-title">{brand.name}</h2>
            </div>
          </div>
        </div>
      )}
      <div className="main-content">
        <BrandDetail brand={brand} />
      </div>
    </>
  );
}
