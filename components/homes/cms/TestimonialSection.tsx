import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TestimonialSection as TestimonialSectionType } from "@/types/homepage";

interface TestimonialSectionProps {
  content: TestimonialSectionType;
  language?: 'ltr' | 'rtl';
}

export default function TestimonialSection({ content, language = 'ltr' }: TestimonialSectionProps) {
  if (!content.isActive) {
    return null;
  }

  const testimonialContent = content as TestimonialSectionType & {
    name?: string;
    position?: string;
    founderName?: string;
    founderTitle?: string;
    title?: string;
    designation?: string;
    role?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  const personName =
    testimonialContent.personName ||
    testimonialContent.founderName ||
    testimonialContent.name ||
    "";
  const personTitle =
    testimonialContent.personTitle ||
    testimonialContent.founderTitle ||
    testimonialContent.position ||
    testimonialContent.designation ||
    testimonialContent.role ||
    testimonialContent.title ||
    "";

  return (
    <section className="section-testimonials h-8 section-one-page" id="testimonials" dir={language}>
      <div className="tf-container position-relative">
        <div className="row rg-60">
          <div className="col-lg-6">
            <div className="image-testimonials img-item tf-animate-1">
              <Image
                src={content.imagePath}
                alt={personName}
                className="lazyload"
                width={605}
                height={605}
                loading="lazy"
                quality={65}
                sizes="(max-width: 991px) 100vw, 50vw"
              />
              <div className="content wow fadeInUp">
                <p className="mb-0">
                  <span className="name">
                    {personName}
                  </span>
                </p>
                <div className="position">{personTitle}</div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="section-testimonials-content ml-25">
              <div className="section-content">
                <div className="heading-section">
                  <div className="wow fadeInUp">
                    <span className="tag label text-btn-uppercase">
                      {content.tag}
                    </span>
                  </div>
                  <h2 className="title-section wow fadeInUp mb-12">
                    {content.heading}
                  </h2>
                  <div
                    className="sub-title body-2 wow fadeInUp cms-rich-text"
                    dangerouslySetInnerHTML={{ __html: content.description }}
                  />
                </div>
                <div className="wow fadeInUp">
                  <Link
                    href={testimonialContent.buttonLink || "/about-us"}
                    className="tf-btn style-1 bg-color-primary"
                  >
                    <span>{testimonialContent.buttonText || (language === "rtl" ? "عن البحار وشركاه" : "About Al Bahar & Partners")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
