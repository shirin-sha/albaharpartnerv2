"use client";

import { timelineItems } from "@/data/timeline";
import React, { useEffect, useMemo, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { HistorySection } from "@/types/aboutus";

interface Props {
  data: HistorySection;
}

export default function HistoryCMS({ data }: Props) {
  const [hoveredItems, setHoveredItems] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  if (!data.isActive) return null;

  const items = data.items && data.items.length > 0 ? data.items : timelineItems;
  const navigationClassSuffix = useMemo(
    () => `${data.language}-${data.heading.replace(/\s+/g, "-").toLowerCase()}`,
    [data.heading, data.language]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="section-process h-8 tf-spacing-2 hover-active-step">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center style-color-white mb-60">
              <div className="text-anime-wave-1">
                <span className="tag label text-btn-uppercase color-white">{data.tag}</span>
              </div>
              <h3 className="title-section mb-12 text-anime-wave-1">
                {data.heading}
              </h3>
              <div className="sub-title body-2 text-anime-wave-1">
                {data.subheading}
              </div>
            </div>
            <div className="wg-time-line">
              <div className="sw-layout-1 swiper-time-line">
                <div className={`tf-btn-arrow style-3 arrow-left nav-prev-layout-1 snbp8-${navigationClassSuffix}`}>
                  <i className="icon-arrow-left" />
                </div>
                {isMounted && (
                  <Swiper
                    slidesPerView={1}
                    breakpoints={{
                      0: { slidesPerView: 1 },
                      575: { slidesPerView: 2 },
                      768: { slidesPerView: 3 },
                      1200: { slidesPerView: 4 },
                    }}
                    observer
                    observeParents
                    resizeObserver
                    updateOnWindowResize
                    watchOverflow
                    dir="ltr"
                    className="swiper sw-layout1"
                    modules={[Navigation]}
                    navigation={{
                      prevEl: `.snbp8-${navigationClassSuffix}`,
                      nextEl: `.snbn8-${navigationClassSuffix}`,
                    }}
                    onSwiper={(swiper) => {
                      requestAnimationFrame(() => swiper.update());
                    }}
                  >
                    {items.map((item, index) => (
                      <SwiperSlide className="swiper-slide" key={index}>
                        <div
                          className={`time-line-item step-hover ${
                            hoveredItems.includes(index) ? "active" : ""
                          } `}
                          onMouseOver={() =>
                            setHoveredItems((pre) => [...pre, index])
                          }
                        >
                          <div className="time-line-content">
                            <div className="heading">
                              <h5 className="title-content">{item.year}</h5>
                            </div>
                            <div className="desc">{item.title}</div>
                            {item.logos && item.logos.length > 0 && (
                              <div className="time-line-logos" style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "center" }}>
                                {item.logos.map((logo, logoIndex) => (
                                  <div key={logoIndex} className="time-line-logo-item">
                                    <Image
                                      src={logo.src}
                                      alt={logo.alt}
                                      width={logo.width || 100}
                                      height={logo.height || 60}
                                      className="lazyload"
                                      unoptimized
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
                <div className={`tf-btn-arrow style-3 arrow-right nav-next-layout-1 snbn8-${navigationClassSuffix}`}>
                  <i className="icon-arrow-right1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
