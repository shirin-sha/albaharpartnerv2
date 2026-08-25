import Link from "next/link";
import React from "react";
import { AboutSection as AboutSectionType } from "@/types/homepage";

interface AboutSectionProps {
  content: AboutSectionType;
  language?: 'ltr' | 'rtl';
}

export default function AboutSection({ content, language = 'ltr' }: AboutSectionProps) {
  if (!content.isActive) {
    return null;
  }
  const isRtl = language === "rtl";

  const aboutLeft = (
    <div className="about-left">
      <div className="heading-section mb-0">
        <div className="text-anime-wave">
          <span className="tag label text-btn-uppercase bg-white">
            {content.tag}
          </span>
        </div>
        <h2 className="mb-0 about-h7-heading">
          {content.heading.split(/<br\s*\/?>/i).map((line, index, array) => (
            <React.Fragment key={index}>
              {line}
              {index < array.length - 1 && <br className="about-h7-break" />}
            </React.Fragment>
          ))}
        </h2>
      </div>
    </div>
  );

  const aboutRight = (
    <div className="about-right">
      <div className="section-content">
        <div
          className="text body-2 color-on-suface-container text-anime-wave-2 cms-rich-text"
          dangerouslySetInnerHTML={{ __html: content.description }}
        />
        <div className="bottom g-40 text-anime-wave-2">
          <Link
            href={content.buttonLink || '/contact-us'}
            className="tf-btn bg-color-primary style-1"
          >
            <span>{content.buttonText}</span>
          </Link>
          <div className="tf-phone">
            <div className="content">
              <p>{content.phoneLabel}</p>
              <p className="mb-0">
                <a href={`tel:${content.phoneNumber}`} className="color-primary">
                  {content.phoneNumber}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section dir={language} className="section-about h-7">
      <div className="tf-container">
        <div className="section-about-h7-row">
          {isRtl ? (
            <>
              {aboutRight}
              {aboutLeft}
            </>
          ) : (
            <>
              {aboutLeft}
              {aboutRight}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
