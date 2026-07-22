import Link from "next/link";
import React from "react";
import { ProcessSection as ProcessSectionType } from "@/types/homepage";

interface ProcessSectionProps {
  content: ProcessSectionType;
  language?: 'ltr' | 'rtl';
}

export default function ProcessSection({ content, language = 'ltr' }: ProcessSectionProps) {
  if (!content.isActive) {
    return null;
  }

  const activeSteps = content.steps
    .filter(step => step.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeSteps.length === 0) {
    return null;
  }

  return (
    <section className="section-process h-8 tf-spacing-2 hover-active-step" dir={language}>
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-12">
            <div className="heading-section style-2 style-color-white">
              <div className="left">
                <div className="text-anime-wave">
                  <span className="tag label text-btn-uppercase color-white">
                    {content.tag}
                  </span>
                </div>
                <h2 className="title-section mb-12 text-anime-wave">
                  {content.heading}
                </h2>
                <div className="sub-title body-2 text-anime-wave">
                  {content.subheading}
                </div>
              </div>
              <div className="text-anime-wave-2">
                <Link href={content.buttonLink || '/contact-us'} className="tf-btn style-1 bg-white">
                  <span>{content.buttonText}</span>
                </Link>
              </div>
            </div>
            <div
              className="sw-case-studies sw-layout"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              {activeSteps.map((step, index) => (
                <div key={index}>
                  <div className="process-item bg-1 bg-1-style-2 step-hover">
                    <div className="process-top">
                      <span className="label text-btn-uppercase">{step.title}</span>
                    </div>
                    <div className="process-content">
                      <div
                        className="desc"
                        dangerouslySetInnerHTML={{ __html: step.description }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
