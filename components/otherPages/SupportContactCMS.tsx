"use client";
import React from "react";
import ContactForm from "@/components/common/ContactForm";
import { SupportContent } from "@/types/support";

interface Props {
  data: SupportContent;
}

export default function SupportContactCMS({ data }: Props) {
  if (!data.contactSection.isActive) return null;

  return (
    <section className="section-contact-home h-2 tf-spacing-15">
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-12">
            <div className="section-contact-home-inner">
              <div className="section-content">
                <div className="heading-section mb-28 style-color-white">
                  <div className="wow fadeInUp">
                    <span className="tag label text-btn-uppercase color-white">
                      {data.contactSection.tag}
                    </span>
                  </div>
                  <h3 className="title-section mb-12 wow fadeInUp">
                    {data.contactSection.heading}
                  </h3>
                  {data.contactSection.subheading && (
                    <div className="sub-title body-2 wow fadeInUp">
                      {data.contactSection.subheading}
                    </div>
                  )}
                </div>
                {data.contactSection.benefits && data.contactSection.benefits.length > 0 && (
                  <div className="cols">
                    <div className="benefit-lists">
                      {data.contactSection.benefits.slice(0, 2).map((benefit, index) => (
                        <div className="benefit-items style-small-2" key={index}>
                          <div className="icon wow fadeInUp">
                            <i className="icon-checkbox" />
                          </div>
                          <div
                            className="caption-1 wow fadeInUp"
                            data-wow-delay=".1s"
                          >
                            {benefit.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    {data.contactSection.benefits.length > 2 && (
                      <div className="benefit-lists">
                        {data.contactSection.benefits.slice(2).map((benefit, index) => (
                          <div className="benefit-items style-small-2" key={index + 2}>
                            <div className="icon wow fadeInUp" data-wow-delay=".2s">
                              <i className="icon-checkbox" />
                            </div>
                            <div
                              className="caption-1 wow fadeInUp"
                              data-wow-delay=".3s"
                            >
                              {benefit.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="list-box-contact">
                  <div className="box-contact-item">
                    <div className="icon wow fadeInUp">
                      <i className="icon-MapPin" />
                    </div>
                    <div className="content">
                      <div
                        className="caption-1 title-section-contact wow fadeInUp"
                        data-wow-delay=".1s"
                      >
                        Location
                      </div>
                      <div className="caption-1 text wow fadeInUp" data-wow-delay=".1s">
                        {data.contactSection.contactInfo.location}
                      </div>
                    </div>
                  </div>
                  {data.contactSection.contactInfo.phoneNumbers && data.contactSection.contactInfo.phoneNumbers.length > 0 && (
                    <div className="box-contact-item">
                      <div className="icon wow fadeInUp" data-wow-delay=".2s">
                        <i className="icon-PhoneCall" />
                      </div>
                      <div className="content">
                        <div
                          className="caption-1 title-section-contact wow fadeInUp"
                          data-wow-delay=".3s"
                        >
                          Support Hotline
                        </div>
                        <div>
                          {data.contactSection.contactInfo.phoneNumbers.map((phone, index) => (
                            <a
                              key={index}
                              href={`tel:${phone}`}
                              className="caption-1 text wow fadeInUp"
                              data-wow-delay=".3s"
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="box-contact-item">
                    <div className="icon wow fadeInUp" data-wow-delay=".4s">
                      <i className="icon-Envelope" />
                    </div>
                    <div className="content">
                      <div
                        className="caption-1 title-section-contact wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        Support Email
                      </div>
                      <a
                        href={`mailto:${data.contactSection.contactInfo.email}`}
                        className="caption-1 text wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        {data.contactSection.contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <ContactForm
                parentClass="form-contact-home"
                title={data.contactSection.formTitle}
                btnClass="tf-btn style-1 bg-white w-full text-center"
                isTitleCenter={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
