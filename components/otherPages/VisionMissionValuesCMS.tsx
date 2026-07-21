import Image from "next/image";
import React from "react";
import { VisionMissionValuesSection } from "@/types/aboutus";

interface Props {
  data: VisionMissionValuesSection;
}

export default function VisionMissionValuesCMS({ data }: Props) {
  if (!data.isActive) return null;

  return (
    <section
      className="section-process h-5 bg-surface tf-spacing-2 section-one-page"
      id="vision-mission-values"
    >
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <div className="text-anime-wave-1">
                <span className="tag bg-white label text-btn-uppercase">{data.tag}</span>
              </div>
              <h3 className="text-anime-wave-1 mb-12">
                {data.heading}
              </h3>
              <div className="sub-title body-2 text-anime-wave-1">
                {data.subheading}
              </div>
            </div>
            <div className="process-list" style={{ alignItems: "flex-start" }}>
              {data.items && data.items.map((item) => (
                <div
                  key={item.id}
                  className="process-item style-2 hover-img"
                  style={{ alignSelf: "flex-start" }}
                >
                  <div className="image">
                    <Image
                      src={item.imagePath}
                      alt={item.label}
                      className="lazyload"
                      width={321}
                      height={320}
                    />
                  </div>
                  <span className="label text-btn-uppercase color-primary">
                    {item.label}
                  </span>
                  <div className="process-content">
                    <h5>
                      <span className="name-process">{item.title}</span>
                    </h5>
                    <div className="desc">
                      {item.description}
                      {item.points && item.points.length > 0 && (
                        <div className="benefit-lists mt-20">
                          {item.points.map((point, i) => (
                            <div key={i} className="benefit-items">
                              <div className="icon">
                                <i className="icon-checkbox" />
                              </div>
                              <div className="title">{point}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
