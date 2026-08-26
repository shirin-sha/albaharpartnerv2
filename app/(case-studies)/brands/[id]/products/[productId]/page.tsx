import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandsContent } from "@/lib/data-fetch";
import ProductDetail from "@/components/case-studies/ProductDetail";
import { BrandProduct } from "@/types/brands";
import { getPageTitleBg } from "@/components/common/PageTitleBanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}): Promise<Metadata> {
  const { id, productId } = await params;
  const content = await getBrandsContent();
  
  const brand = content?.brands?.find((b) => {
    if (!b.name) return b._id === id;
    return b._id === id || createSlug(b.name) === id;
  });
  const product = brand?.products?.find(
    (p) => {
      if (p._id === productId) return true;
      if (!p.name) return false;
      return createSlug(p.name) === productId;
    }
  );
  
  return {
    title: product?.name
      ? `${product.name} - ${brand?.name || "Brand"} - Al bahar and partners`
      : "Product Details - Al bahar and partners",
    description: product?.description 
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Learn more about ${product?.name || "this product"}`,
  };
}

// Helper function to create a slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = await params;
  const content = await getBrandsContent();

  if (!content) {
    notFound();
  }

  // Find brand by _id or slug
  const brand = content.brands?.find(
    (b) => {
      if (!b.name) return b._id === id;
      const brandSlug = createSlug(b.name);
      return b._id === id || brandSlug === id;
    }
  );

  if (!brand || !brand.isActive) {
    notFound();
  }

  // Find product by _id or slug
  const product: BrandProduct | undefined = brand.products?.find(
    (p, index) => {
      // Try _id first
      if (p._id === productId) return true;
      // Try slug from name
      if (p.name) {
        const productSlug = createSlug(p.name);
        if (productSlug === productId) return true;
      }
      // Try index-based slug as fallback
      if (productId === `product-${index}`) return true;
      return false;
    }
  );

  if (!product) {
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
        <div {...getPageTitleBg(headerData.imagePath, "bg-img-11")}>
          <div className="tf-container">
            <div className="page-title-content">
              <div className="breadkcum">
                <Link href={`/`} className="caption-1 home">
                  Homepage
                </Link>{" "}
                <span className="arrow-svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_9360_28061)">
                      <path
                        d="M3.125 10H16.875"
                        stroke="#A2A3AB"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.25 4.375L16.875 10L11.25 15.625"
                        stroke="#A2A3AB"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath>
                        <rect width={20} height={20} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>{" "}
                <Link href={`/brands`} className="caption-1 home">
                  Brands
                </Link>{" "}
                <span className="arrow-svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_9360_28061)">
                      <path
                        d="M3.125 10H16.875"
                        stroke="#A2A3AB"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.25 4.375L16.875 10L11.25 15.625"
                        stroke="#A2A3AB"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath>
                        <rect width={20} height={20} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>{" "}
                <Link 
                  href={`/brands/${id}`} 
                  className="caption-1 home"
                >
                  {brand.name}
                </Link>{" "}
                <span className="arrow-svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_9360_28061)">
                      <path
                        d="M3.125 10H16.875"
                        stroke="#A2A3AB"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.25 4.375L16.875 10L11.25 15.625"
                        stroke="#A2A3AB"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath>
                        <rect width={20} height={20} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>{" "}
                <span className="caption-1 page-breadkcum">{product.name}</span>
              </div>
              <h2 className="title-page-title">Product Details</h2>
              <div className="sub-title body-2">
                Explore detailed information about our products
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="main-content">
        <ProductDetail product={product} brandName={brand.name} />
      </div>
    </>
  );
}
