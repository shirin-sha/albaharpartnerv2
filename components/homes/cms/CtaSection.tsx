import Link from "next/link";
import Image from "next/image";
import React from "react";
import { CtaSection as CtaSectionType } from "@/types/homepage";

interface CtaSectionProps {
  content: CtaSectionType;
  language?: 'ltr' | 'rtl';
}

export default function CtaSection({ content, language = 'ltr' }: CtaSectionProps) {
  if (!content.isActive) {
    return null;
  }

  const ctaBackgroundImage =
    content.imagePath || "/image/section/bg-section-banner-h8.jpg";

  return (
    <section
      className="section-banner h-8 tf-spacing-2 section-one-page"
      id="cta"
      dir={language}
    >
      <Image
        src={ctaBackgroundImage}
        alt=""
        fill
        className="section-banner-bg"
        loading="lazy"
        quality={65}
        sizes="100vw"
      />
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-lg-6">
            <div className="section-content">
              <div className="heading-section style-color-white">
                <div className="wow fadeInUp">
                  <span className="tag label text-btn-uppercase bg-white">
                    {content.tag}
                  </span>
                </div>
                <h2 className="title-section mb-12 wow fadeInUp">
                  {content.heading}
                </h2>
                <div
                  className="sub-title body-2 wow fadeInUp"
                  dangerouslySetInnerHTML={{ __html: content.description }}
                />
              </div>
              <div className="bottom g-20">
                <div className="wow fadeInUp">
                  <Link
                    href={content.buttonLink || '/contact-us'}
                    className="tf-btn style-1 bg-white"
                  >
                    <span>{content.buttonText}</span>
                  </Link>
                </div>
                <div className="tf-phone no-border color-white g-14">
                  <a
                    href={`tel:${content.phoneNumber}`}
                    className="icon wow fadeInUp"
                    data-wow-delay=".1s"
                    aria-label={`Call ${content.phoneNumber}`}
                  >
                    <span className="visually-hidden">{`Call ${content.phoneNumber}`}</span>
                    <i className="icon-PhoneCall" aria-hidden />
                  </a>
                  <div className="content wow fadeInUp" data-wow-delay=".2s">
                    <p className="caption-2">{content.phoneLabel}</p>
                    <p className="mb-0">
                      <a href={`tel:${content.phoneNumber}`}>{content.phoneNumber}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
