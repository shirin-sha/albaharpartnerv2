import React from "react";
import PageTitleBanner from "@/components/common/PageTitleBanner";
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
        <PageTitleBanner
          breadcrumb={headerData.breadcrumb}
          title={brand.name}
          imagePath={headerData.imagePath}
          isActive={headerData.isActive}
        />
      )}
      <div className="main-content">
        <BrandDetail brand={brand} />
      </div>
    </>
  );
}
