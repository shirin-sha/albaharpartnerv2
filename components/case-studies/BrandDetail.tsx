"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Brand } from "@/types/brands";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Props {
  brand: Brand;
}

export default function BrandDetail({ brand }: Props) {
  const products = brand.products || [];

  return (
    <>
      {/* Section 1: Brand Name, Description, and Image */}
      <div className="section-product-details tf-spacing-2">
        <div className="tf-container">
          <div className="row mb-66 rg-60">
            <div className="col-lg-6">
              <div className="thumbs-slider">
                <div className="image brand-detail-logo-frame">
                  <Image
                    src={brand.imagePath}
                    alt={brand.name}
                    width={600}
                    height={338}
                    className="lazyload brand-detail-logo-img"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="tf-product-info-wrap position-relative ml-50">
                <div className="tf-product-info-heading">
                  <h4 className="name-product">{brand.name}</h4>
                </div>
                <div className="tf-product-info-desc">
                  {brand.description && (
                    <p>{brand.description}</p>
                  )}
                </div>
                {brand.link && brand.link !== "#" && (
                  <div className="mt-4">
                    <Link
                      href={brand.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tf-btn style-1"
                    >
                      Learn More
                      <i className="icon-arrowRight ms-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Products List */}
      {products.length > 0 && (
        <section className="section-related-products tf-spacing-3">
          <div className="tf-container">
            <div className="row">
              <div className="col-12">
                <div className="heading-section text-center">
                  <h4>Products</h4>
                </div>
                <Swiper
                  dir="ltr"
                  className="swiper sw-layout sw-product"
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    575: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    992: {
                      spaceBetween: 30,
                    },
                    1200: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                  }}
                  modules={[Pagination]}
                  pagination={{
                    clickable: true,
                    el: ".spe10",
                  }}
                >
                  {products.map((product, i) => {
                    // Create slug from product name for URL
                    const createSlug = (name: string): string => {
                      if (!name || name.trim() === '') return '';
                      return name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    };
                    
                    // Get brand slug for URL - use _id if available, otherwise slug
                    const brandSlug = brand._id || (brand.name ? createSlug(brand.name) : `brand-${i}`);
                    
                    // Get product slug for URL - use _id if available, otherwise slug or index
                    let productSlug = product._id;
                    if (!productSlug && product.name) {
                      productSlug = createSlug(product.name);
                    }
                    if (!productSlug) {
                      productSlug = `product-${i}`;
                    }
                    
                    const productUrl = `/brands/${brandSlug}/products/${productSlug}`;
                    
                    return (
                      <SwiperSlide key={product._id || i} className="swiper-slide">
                        <Link href={productUrl} className="product-item hover-img" style={{ textDecoration: 'none', display: 'block' }}>
                          <div className="image">
                            <Image
                              src={product.imagePath || "/image/placeholder.jpg"}
                              alt={product.name || 'Product'}
                              className="lazyload"
                              width={300}
                              height={300}
                            />
                          </div>
                          <div className="product-item-content">
                            <div className="name-product title">{product.name || 'Untitled Product'}</div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                  <div className="sw-pagination-layout flex justify-content-center spe10" />
                </Swiper>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
