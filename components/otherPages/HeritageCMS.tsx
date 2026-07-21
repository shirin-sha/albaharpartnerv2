import Image from "next/image";
import React from "react";
import { HeritageSection } from "@/types/aboutus";

interface Props {
  data: HeritageSection;
}

export default function HeritageCMS({ data }: Props) {
  if (!data.isActive) return null;

  return (
    <section className="section-why-choose h-2 tf-spacing-2">
      <div className="tf-container position-relative">
        <div className="row rg-60 align-items-center">
          <div className="col-lg-6">
            <div className="image mr-15 tf-animate-1">
              <Image
                src={data.imagePath}
                alt={data.heading}
                className="lazyload"
                width={615}
                height={615}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="section-content ml-15">
              <div className="heading-section">
                <div className="wow fadeInUp">
                  <span className="tag label text-btn-uppercase">{data.tag}</span>
                </div>
                <h3 className="title-section wow fadeInUp mb-12" dangerouslySetInnerHTML={{ __html: data.heading }} />
                <div className="sub-title body-2 wow fadeInUp">
                  {data.paragraphs && data.paragraphs.map((paragraph, index) => (
                    <p key={index} className={index < data.paragraphs.length - 1 ? "mb-20" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
