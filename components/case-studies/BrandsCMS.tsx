"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BrandsContent } from "@/types/brands";

interface Props {
  data: BrandsContent;
}

// Helper function to create a slug from brand name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function BrandsCMS({ data }: Props) {
  if (!data.isActive) return null;

  const activeBrands = (data.brands || [])
    .filter(brand => brand.isActive);

  if (activeBrands.length === 0) return null;

  return (
    <div className="page-case-content tf-spacing-2">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {data.tag && data.heading && (
              <div className="heading-section text-center mb-60">
                <div className="text-anime-wave-1">
                  <span className="tag label text-btn-uppercase bg-white">{data.tag}</span>
                </div>
                <h3 className="title-section text-anime-wave-1 mb-12">
                  {data.heading}
                </h3>
                {data.subheading && (
                  <div className="sub-title body-2 text-anime-wave-1">
                    {data.subheading}
                  </div>
                )}
              </div>
            )}
            <div className="brands-grid-container">
              <div className="row g-4">
                {activeBrands.map((brand, index) => {
                  const brandSlug = brand._id || createSlug(brand.name);
                  const detailUrl = `/brands/${brandSlug}`;
                  
                  return (
                    <div
                      className="col-lg-3 col-md-4 col-sm-6 col-12"
                      key={brand._id || index}
                    >
                      <Link href={detailUrl} className="brand-logo-card">
                        <div className="brand-logo-frame">
                          <Image
                            src={brand.imagePath}
                            alt={brand.name}
                            width={320}
                            height={180}
                            className="brand-logo-img"
                          />
                        </div>
                        <h5 className="brand-logo-name">{brand.name}</h5>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
