"use client";

import React from "react";
import OdometerComponent from "@/components/common/OdometerComponent";
import { AboutAlBaharSection } from "@/types/aboutus";

interface Props {
  data: AboutAlBaharSection;
}

export default function AboutAlBaharCMS({ data }: Props) {
  if (!data.isActive) return null;

  return (
    <section
      className="section-about h-1 h-3 tf-spacing-2 section-one-page"
      id="about"
    >
      <div className="tf-container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="heading-section about-content-left">
              <div className="text-anime-wave">
                <span className="tag label text-btn-uppercase">{data.tag}</span>
              </div>
              <h3
                className="title-section mb-40 about-albahar-title"
                dangerouslySetInnerHTML={{ __html: data.title }}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="about-content-right p-0">
              <div className="counter-item">
                <div className="counter">
                  <div className="number-counter mb-0">
                    <h2 className="number odometer color-primary">
                      <OdometerComponent max={data.counterValue} />
                    </h2>
                    <h2 className="plus color-primary">+</h2>
                  </div>
                  <p className="text text-btn-uppercase label color-on-suface-variant-1">
                    {data.counterLabel}
                  </p>
                </div>
              </div>
              {data.tabs && data.tabs.length > 0 && (
                <div className="flat-animate-tab">
                  <div className="wg-tab style-small">
                    <ul className="tab-product min-w-366" role="tablist">
                      {data.tabs.map((tab, index) => (
                        <li key={tab.id} className="nav-tab-item" role="presentation">
                          <h6>
                            <a
                              href={`#${tab.id}`}
                              data-bs-toggle="tab"
                              role="tab"
                              className={index === 0 ? 'active' : ''}
                            >
                              {tab.title}
                            </a>
                          </h6>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="tab-content">
                    {data.tabs.map((tab, index) => (
                      <div
                        key={tab.id}
                        className={`tab-pane ${index === 0 ? 'active show' : ''}`}
                        id={tab.id}
                        role="tabpanel"
                      >
                        <p className="text">{tab.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
