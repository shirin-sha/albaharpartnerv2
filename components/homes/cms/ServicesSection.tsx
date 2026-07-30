"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { ServicesSection as ServicesSectionType } from "@/types/homepage";

interface ServicesSectionProps {
  content: ServicesSectionType;
  language?: 'ltr' | 'rtl';
}

export default function ServicesSection({ content, language = 'ltr' }: ServicesSectionProps) {
  if (!content.isActive) {
    return null;
  }

  // Filter and sort active services
  const activeServices = content.services
    .filter(service => service.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeServices.length === 0) {
    return null;
  }

  const learnMoreLabel = language === "rtl" ? "اعرف المزيد" : "Learn More";
  const detailsBasePath = language === "rtl" ? "/ar/services-details-1" : "/services-details-1";

  return (
    <section
      className="section-services h-8 tf-spacing-18 section-one-page"
      id="services"
      dir={language}
    >
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <div className="text-anime-wave-1">
                <span className="tag label text-btn-uppercase">
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
            <div className="flat-animate-tab">
              <div className="wg-tab">
                <ul
                  className="tab-product g-40 justify-content-between min-w-1131"
                  role="tablist"
                >
                  {activeServices.map((service, index) => {
                    const panelId = `services-panel-${service.id}`;
                    const tabId = `services-tab-${service.id}`;
                    return (
                      <li className="nav-tab-item" role="none" key={service.id}>
                        <button
                          type="button"
                          id={tabId}
                          className={`tab-trigger${index === 0 ? " active" : ""}`}
                          role="tab"
                          aria-selected={index === 0}
                          aria-controls={panelId}
                          tabIndex={index === 0 ? 0 : -1}
                          data-bs-toggle="tab"
                          data-bs-target={`#${panelId}`}
                        >
                          {service.tabTitle}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="tab-content">
                {activeServices.map((service, index) => (
                  (() => {
                    const detailsHref = `${detailsBasePath}/${service.id}`;
                    return (
                  <div
                    key={service.id}
                    className={`tab-pane${index === 0 ? " active show" : ""}`}
                    id={`services-panel-${service.id}`}
                    role="tabpanel"
                    aria-labelledby={`services-tab-${service.id}`}
                  >
                    <div className="services-inner bg-surface">
                      <div className="services-content p-40 services-content-spacious">
                        <h3 className="title-content mb-12">
                          <Link href={detailsHref}>{service.title}</Link>
                        </h3>
                        <div className="sub-title mb-28 body-2">
                          {service.description.split('<br/>').map((line, i, array) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < array.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="benefit-lists mb-20">
                          {service.benefits.map((benefit, i) => (
                            <div className="benefit-items" key={i}>
                              <div className="icon">
                                <i className="icon-checkbox" />
                              </div>
                              <div className="title">{benefit}</div>
                            </div>
                          ))}
                        </div>
                        <Link
                          href={detailsHref}
                          className="tf-btn style-1 bg-color-primary"
                        >
                          <span>{learnMoreLabel}</span>
                        </Link>
                      </div>
                      <div className="image services-image-wrap">
                        <Image
                          src={service.imgSrc}
                          alt={service.title}
                          className="lazyload services-image-fill"
                          width={960}
                          height={720}
                          loading={index === 0 ? "eager" : "lazy"}
                          quality={65}
                          sizes="(max-width: 991px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </div>
                    );
                  })()
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
