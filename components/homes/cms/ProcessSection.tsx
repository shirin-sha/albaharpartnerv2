import Link from "next/link";
import Image from "next/image";
import React from "react";
import { ProcessSection as ProcessSectionType } from "@/types/homepage";

const DEFAULT_BANNER = "/image/section/bg-section-process-h8.jpg";

interface ProcessSectionProps {
  content: ProcessSectionType;
  language?: "ltr" | "rtl";
}

export default function ProcessSection({
  content,
  language = "ltr",
}: ProcessSectionProps) {
  if (!content.isActive) {
    return null;
  }

  const activeSteps = (content.steps || [])
    .filter((step) => step.isActive)
    .sort((a, b) => a.order - b.order);

  const bannerSrc = content.imagePath?.trim() || DEFAULT_BANNER;
  const rawHref = content.buttonLink || "/contact-us";
  const buttonHref =
    language === "rtl" &&
    rawHref.startsWith("/") &&
    !rawHref.startsWith("/ar")
      ? rawHref === "/"
        ? "/ar"
        : `/ar${rawHref}`
      : rawHref;

  return (
    <section className="section-advantage" dir={language}>
      <div className="advantage-banner">
        <Image
          src={bannerSrc}
          alt={content.heading}
          className="advantage-banner-image"
          fill
          loading="eager"
          quality={75}
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div className="advantage-banner-overlay" aria-hidden="true" />
        <div className="tf-container advantage-banner-inner">
          <div className="advantage-banner-content text-center">
            {content.tag && (
              <div className="advantage-tag-wrap">
                <span className="advantage-tag text-btn-uppercase">
                  {content.tag}
                </span>
              </div>
            )}
            <h2 className="advantage-heading">{content.heading}</h2>
            {content.subheading && (
              <p className="advantage-desc body-2">{content.subheading}</p>
            )}
            {content.buttonText && (
              <Link
                href={buttonHref}
                className="tf-btn style-1 bg-white hover-bg-primary advantage-cta"
              >
                <span>{content.buttonText}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {activeSteps.length > 0 && (
        <div className="advantage-features">
          <div className="tf-container">
            <div className="advantage-features-grid">
              {activeSteps.map((step, index) => (
                <div
                  className="advantage-feature-item"
                  key={step._id || `${step.order}-${index}`}
                >
                  <h5 className="advantage-feature-title text-btn-uppercase">
                    {step.title}
                  </h5>
                  <div className="advantage-feature-line" aria-hidden="true" />
                  <div
                    className="advantage-feature-text"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
