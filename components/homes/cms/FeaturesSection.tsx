import Link from "next/link";
import Image from "next/image";
import React from "react";
import OdometerComponent from "@/components/common/OdometerComponent";
import { FeaturesSection as FeaturesSectionType } from "@/types/homepage";

interface FeaturesSectionProps {
  content: FeaturesSectionType;
  language?: 'ltr' | 'rtl';
}

export default function FeaturesSection({ content, language = 'ltr' }: FeaturesSectionProps) {
  if (!content.isActive) {
    return null;
  }

  const activeCounters = content.counters
    .filter(counter => counter.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="section-why-choose h-7 bg-surface tf-spacing-31" dir={language}>
      <div className="tf-container position-relative tf-spacing-3">
        <div className="row rg-60">
          <div className="col-xl-6">
            <div className="image mr-15">
              <Image
                src={content.imagePath}
                alt={content.heading}
                className="lazyload"
                width={615}
                height={615}
                loading="lazy"
                quality={65}
                sizes="(max-width: 1199px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="col-xl-6">
            <div className="section-content ml-15">
              <div className="heading-section">
                <div className="wow fadeInUp">
                  <span className="tag label text-btn-uppercase bg-white">
                    {content.tag}
                  </span>
                </div>
                <h2 className="wow fadeInUp mb-12">
                  {content.heading}
                </h2>
                <div className="sub-title body-2 wow fadeInUp">
                  {content.description}
                </div>
              </div>
              <div className="cols g-10 mb-36">
                <div className="benefit-lists">
                  {content.benefits.slice(0, Math.ceil(content.benefits.length / 2)).map((benefit, index) => (
                    <div className="benefit-items" key={index}>
                      <div className="icon wow fadeInUp">
                        <i className="icon-checkbox" />
                      </div>
                      <div className="title wow fadeInUp" data-wow-delay=".1s">
                        {benefit}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="benefit-lists">
                  {content.benefits.slice(Math.ceil(content.benefits.length / 2)).map((benefit, index) => (
                    <div className="benefit-items" key={index}>
                      <div className="icon wow fadeInUp" data-wow-delay=".2s">
                        <i className="icon-checkbox" />
                      </div>
                      <div className="title wow fadeInUp" data-wow-delay=".3s">
                        {benefit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="wow fadeInUp">
                <Link
                  href={content.buttonLink || '/contact-us'}
                  className="tf-btn style-1 bg-color-primary"
                >
                  <span>{content.buttonText}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeCounters.length > 0 && (
        <div className="tf-container position-relative">
          <div className="row">
            <div className="col-12">
              <div className="wg-counter justify-content-between">
                {activeCounters.map((counter, index) => (
                  <div className="counter-item style-3" key={index}>
                    <div className="counter">
                      <div className="number-counter">
                        <div className="number odometer">
                          <OdometerComponent max={counter.value} />
                        </div>
                        <div className="plus" aria-hidden="true">
                          +
                        </div>
                      </div>
                      <div
                        className="text"
                        dangerouslySetInnerHTML={{ __html: counter.label }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
