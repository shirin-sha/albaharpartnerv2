import React from "react";
import { SupportContent } from "@/types/support";

interface Props {
  data: SupportContent;
}

export default function SupportServicesCMS({ data }: Props) {
  if (!data.servicesSection.isActive) return null;

  const activeServices = (data.servicesSection.services || [])
    .filter(service => service.isActive);

  if (activeServices.length === 0) return null;

  return (
    <section className="section-industry page-industry tf-spacing-2">
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <div className="text-anime-wave-1">
                <span className="tag label text-btn-uppercase">{data.servicesSection.tag}</span>
              </div>
              <h3 className="title-section text-anime-wave-1 mb-12">
                {data.servicesSection.heading}
              </h3>
              {data.servicesSection.subheading && (
                <div className="sub-title body-2 color-on-suface-container text-anime-wave-1">
                  {data.servicesSection.subheading}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="tf-container position-relative">
        <div className="row rg-20">
          {activeServices.map((service, index) => (
            <div className="col-lg-4 col-md-6" key={service._id || index}>
              <div className="industry-item style-2">
                <div className="top">
                  <div className="icon">
                    {service.iconClass ? (
                      <i className={service.iconClass} />
                    ) : service.iconSvg ? (
                      <div dangerouslySetInnerHTML={{ __html: service.iconSvg }} />
                    ) : (
                      <i className="icon-Briefcase" />
                    )}
                  </div>
                  <h6>
                    <span className="name-industry">{service.title}</span>
                  </h6>
                </div>
                <div className="desc">{service.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
