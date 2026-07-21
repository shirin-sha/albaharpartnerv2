import Image from "next/image";
import React from "react";
import { AboutBPCSection } from "@/types/aboutus";

interface Props {
  data: AboutBPCSection;
}

export default function AboutBPCCMS({ data }: Props) {
  if (!data.isActive) return null;

  const renderWithLineBreaks = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

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
            <h3 className="wow fadeInUp mb-32">{data.heading}</h3>
            <div className="sub-title body-2 mb-28 wow fadeInUp">
              {renderWithLineBreaks(data.description)}
            </div>
            {data.serviceOfferings && data.serviceOfferings.length > 0 && (
              <div className="sub-title body-2 mb-28 wow fadeInUp" data-wow-delay=".1s">
                <strong>{data.serviceOfferingsTitle}</strong>
                <br />
                {data.serviceOfferings.map((offering, index) => (
                  <span key={index} className={`d-block ${index === 0 ? "mt-12" : ""}`}>
                    <strong>{offering.split(":")[0]}:</strong> {offering.split(":")[1] || offering}
                  </span>
                ))}
              </div>
            )}
            {data.coreIndustries && data.coreIndustries.length > 0 && (
              <div className="sub-title body-2 wow fadeInUp" data-wow-delay=".2s">
                <strong>{data.coreIndustriesTitle}</strong>
                <br />
                {data.coreIndustries.map((industry, index) => (
                  <span key={index} className={`d-block ${index === 0 ? "mt-12" : ""}`}>
                    • {industry}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
