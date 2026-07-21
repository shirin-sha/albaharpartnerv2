import React from "react";
import { AboutBDSSection } from "@/types/aboutus";

interface Props {
  data: AboutBDSSection;
}

export default function AboutBDSCMS({ data }: Props) {
  if (!data.isActive) return null;

  // Split services into two columns
  const midPoint = Math.ceil((data.services?.length || 0) / 2);
  const leftColumn = data.services?.slice(0, midPoint) || [];
  const rightColumn = data.services?.slice(midPoint) || [];

  return (
    <section className="section-why-choose h-2 tf-spacing-2 our-advantage-bg">
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-12">
            <div className="heading-section">
              <div className="wow fadeInUp">
                <span className="tag label bg-white text-btn-uppercase">{data.tag}</span>
              </div>
              <h3 className="title-section wow fadeInUp mb-12">
                {data.heading}
              </h3>
              <div className="sub-title body-2 wow fadeInUp mb-40">
                {data.description}
              </div>
              {data.servicesIntro && (
                <div className="sub-title body-2 wow fadeInUp mb-20">
                  {data.servicesIntro}
                </div>
              )}
            </div>
            {data.services && data.services.length > 0 && (
              <div className="row rg-30">
                <div className="col-lg-6">
                  <div className="benefit-lists">
                    {leftColumn.map((service, index) => (
                      <div key={index} className="benefit-items">
                        <div className="icon wow fadeInUp">
                          <i className="icon-checkbox" />
                        </div>
                        <div
                          className="title wow fadeInUp"
                          data-wow-delay={`${(index + 1) * 0.1}s`}
                        >
                          {service}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="benefit-lists">
                    {rightColumn.map((service, index) => (
                      <div key={index} className="benefit-items">
                        <div className="icon wow fadeInUp">
                          <i className="icon-checkbox" />
                        </div>
                        <div
                          className="title wow fadeInUp"
                          data-wow-delay={`${(index + midPoint + 1) * 0.1}s`}
                        >
                          {service}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
