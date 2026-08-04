import Image from "next/image";
import React from "react";
import { BrandsSection as BrandsSectionType } from "@/types/homepage";

interface BrandsSectionProps {
  content: BrandsSectionType;
  language?: 'ltr' | 'rtl';
}

export default function BrandsSection({ content, language = 'ltr' }: BrandsSectionProps) {
  if (!content.isActive) {
    return null;
  }

  const activeBrands = content.brands
    .filter(brand => brand.isActive);

  if (activeBrands.length === 0) {
    return null;
  }

  return (
    <section className="section-brand h-7 tf-spacing-7 section-one-page" id="brands" dir={language}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="text-heading">
              <h2 className="h5 mb-0">
                <span>{content.heading}</span>
              </h2>
            </div>
            <div className="tf-marquee tf-spacing-25">
              <div className="marquee-wrapper">
                <div className="initial-child-container">
                  {activeBrands.map((brand, index) => (
                    <div className="marquee-child-item" style={{ marginRight: '60px' }} key={index}>
                      {brand.link && brand.link !== "#" ? (
                        <a
                          href={brand.link}
                          className="brand-item"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={brand.name}
                        >
                          <span className="visually-hidden">
                            {`Visit ${brand.name}`}
                          </span>
                          <Image
                            alt=""
                            src={brand.imagePath}
                            width={200}
                            height={100}
                            className="brand-marquee-img"
                            loading="lazy"
                            quality={70}
                            sizes="200px"
                          />
                        </a>
                      ) : (
                        <span className="brand-item">
                          <Image
                            alt={brand.name}
                            src={brand.imagePath}
                            width={200}
                            height={100}
                            className="brand-marquee-img"
                            loading="lazy"
                            quality={70}
                            sizes="200px"
                          />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
