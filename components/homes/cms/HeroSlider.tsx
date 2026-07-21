"use client";
import { HeroSlide } from "@/types/homepage";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface HeroSliderProps {
  slides: HeroSlide[];
  language?: 'ltr' | 'rtl';
}

export default function HeroSlider({ slides, language = 'ltr' }: HeroSliderProps) {
  // Filter and sort active slides
  const activeSlides = slides
    .filter(slide => slide.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeSlides.length === 0) {
    return null;
  }

  return (
    <Swiper
      className="page-title-home h-7 swiper sw-auto style-absolute"
      loop
      effect="slide"
      modules={[EffectFade, Autoplay, Navigation]}
      navigation={{
        prevEl: ".snbp7",
        nextEl: ".snbn7",
      }}
      autoplay={{
        delay: 4000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      }}
      dir={language}
    >
      <button type="button" aria-label="Previous slide" className="tf-btn-arrow arrow-left sw-auto-next snbp7">
        <i className="icon-arrow-left" />
      </button>
      {activeSlides.map((slide, index) => (
        <SwiperSlide className="swiper-slide" key={index}>
          <div className="page-title-inner">
            <Image
              src={slide.image}
              alt={slide.title}
              className="hero-banner-image"
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={index === 0 ? 72 : 60}
              unoptimized={index === 0}
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className="hero-overlay" />
            <div className="tf-container hero-container">
              <div className="row hero-row">
                <div className="col-12 hero-col">
                  <div className={`page-title-content ${language === 'rtl' ? 'rtl-content' : ''}`}>
                    <h1 
                      className="tf-fade-top fade-item-1"
                      dir={language === 'rtl' ? 'rtl' : 'ltr'}
                      style={language === 'rtl' ? { textAlign: 'right' } : {}}
                    >
                      {slide.title.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </h1>
                    <div 
                      className="sub-title body-2 tf-fade-top fade-item-2"
                      dir={language === 'rtl' ? 'rtl' : 'ltr'}
                      style={language === 'rtl' ? { textAlign: 'right' } : {}}
                    >
                      {slide.subtitle}
                    </div>
                    <div className="tf-fade-top fade-item-3">
                      <Link
                        href={slide.buttonLink && slide.buttonLink !== "#" ? slide.buttonLink : "/solutions"}
                        className="tf-btn style-1 bg-white "
                      >
                        <span>{slide.buttonText || "View All Services"}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <button type="button" aria-label="Next slide" className="tf-btn-arrow arrow-right sw-auto-prev snbn7">
        <i className="icon-arrow-right1" />
      </button>
    </Swiper>
  );
}
