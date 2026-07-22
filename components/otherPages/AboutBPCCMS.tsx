import Image from "next/image";
import React from "react";
import CmsRichText from "@/components/common/CmsRichText";
import { AboutBPCSection } from "@/types/aboutus";

interface Props {
  data: AboutBPCSection;
}

export default function AboutBPCCMS({ data }: Props) {
  if (!data.isActive) return null;

  return (
    <section className="section-about h-6 bpc-half-split section-one-page" id="cta">
      <div className="section-about-inner">
        <div className="image tf-animate-1">
          <Image
            src={data.imagePath}
            alt={data.heading}
            className="lazyload"
            width={900}
            height={900}
          />
        </div>
        <div className="section-about-content">
          <div className="heading-section style-color-white mb-0">
            <div className="wow fadeInUp">
              <span className="tag label text-btn-uppercase color-white">
                {data.tag}
              </span>
            </div>
            <h3 className="title-section wow fadeInUp mb-12">{data.heading}</h3>
            <CmsRichText
              html={data.description}
              className="sub-title body-2 wow fadeInUp"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
