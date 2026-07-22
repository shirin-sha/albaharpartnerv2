import Image from "next/image";
import React from "react";
import Link from "next/link";
import { CaseStudiesSection as CaseStudiesSectionType } from "@/types/homepage";

interface CaseStudiesSectionProps {
  content: CaseStudiesSectionType;
  language?: 'ltr' | 'rtl';
}

export default function CaseStudiesSection({ content, language = 'ltr' }: CaseStudiesSectionProps) {
  if (!content.isActive) {
    return null;
  }

  const activeCaseStudies = content.caseStudies
    .filter(cs => cs.isActive);

  if (activeCaseStudies.length === 0) {
    return null;
  }

  return (
    <section
      className="section-case h-3 h-8 bg-surface tf-spacing-26 section-one-page"
      id="project"
      dir={language}
    >
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <div className="text-anime-wave-1">
                <span className="tag label text-btn-uppercase bg-white">
                  {content.tag}
                </span>
              </div>
              <h2 className="title-section text-anime-wave-1 mb-12">
                {content.heading}
              </h2>
              <div className="sub-title body-2 text-anime-wave-1">
                {content.subheading}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="sw-project-list sw-layout case-studies-grid-layout">
          {activeCaseStudies.map((caseStudy, index) => (
            <div key={index}>
              <div className="case-studies-item style-bg-content hover-img style-2">
                <Link
                  href={caseStudy.link || "#"}
                  className="image d-block media-card-ratio"
                  aria-label={`View case study ${caseStudy.title}`}
                >
                  <span className="visually-hidden">
                    {`View case study: ${caseStudy.title}`}
                  </span>
                  <Image
                    src={caseStudy.imagePath}
                    alt={caseStudy.title}
                    fill
                    sizes="(max-width: 575px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="media-fill-cover"
                    loading="lazy"
                    quality={65}
                  />
                </Link>
                <Link href={caseStudy.link || "#"} className="btn-arrow-item" aria-label={`Open ${caseStudy.title}`}>
                  <span className="visually-hidden">{`Open ${caseStudy.title}`}</span>
                  <i className="icon-arrowRight" aria-hidden />
                </Link>
                <div className="case-studies-content">
                  <h3>
                    <Link href={caseStudy.link || "#"} className="name">
                      {caseStudy.title}
                    </Link>
                  </h3>
                  <div
                    className="desc cms-rich-text"
                    dangerouslySetInnerHTML={{ __html: caseStudy.description }}
                  />
                  <Link href={caseStudy.link || "#"} className="tf-btn-arrow-t-r">
                    <span>View Case Study</span>
                    <div className="icon">
                      <i className="icon-arrow-top-right" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
