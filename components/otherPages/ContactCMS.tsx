"use client";
import React from "react";
import Link from "next/link";
import ContactForm from "@/components/common/ContactForm";
import { ContactUsContent } from "@/types/contact-us";

interface Props {
  data: ContactUsContent;
}

export default function ContactCMS({ data }: Props) {
  if (!data.contactSection.isActive) return null;
  const isRtl = data.language === "rtl";
  const fallbackLabels = isRtl
    ? { address: "العنوان", phone: "الهاتف", email: "البريد الإلكتروني" }
    : { address: "Address", phone: "Telephone", email: "Email" };
  const labels = {
    address: data.contactSection.contactInfoLabels?.address || fallbackLabels.address,
    phone: data.contactSection.contactInfoLabels?.phone || fallbackLabels.phone,
    email: data.contactSection.contactInfoLabels?.email || fallbackLabels.email,
  };

  return (
    <section className="section-contact-home page-contact tf-spacing-2">
      <div className="tf-container position-relative">
        <div className="row rg-60">
          <div className="col-lg-7">
            <div className="section-contact-home-inner mr-30">
              <div className="section-content">
                <div className="heading-section mb-28">
                  <div className="wow fadeInUp">
                    <Link
                      href={`/contact-us`}
                      className="tag label text-btn-uppercase mb-12"
                    >
                      {data.contactSection.tag}
                    </Link>
                  </div>
                  <h3 className="title-section mb-12 wow fadeInUp">
                    {data.contactSection.heading}
                  </h3>
                  {data.contactSection.subheading && (
                    <div className="sub-title body-2 color-on-suface-container wow fadeInUp">
                      {data.contactSection.subheading}
                    </div>
                  )}
                </div>
                {data.contactSection.benefits && data.contactSection.benefits.length > 0 && (
                  <div className="cols">
                    <div className="benefit-lists item">
                      {data.contactSection.benefits.slice(0, 2).map((benefit, index) => (
                        <div className="benefit-items" key={index}>
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
                      <div className="benefit-lists item">
                        {data.contactSection.benefits.slice(2).map((benefit, index) => (
                          <div className="benefit-items" key={index + 2}>
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
                  <div className="box-contact-item style-bg-white">
                    <div className="icon wow fadeInUp">
                      <i className="icon-MapPin" />
                    </div>
                    <div className="content wow fadeInUp" data-wow-delay=".1s">
                      <div className="caption-1 title-section-contact">
                        {labels.address}
                      </div>
                      <div
                        className="caption-1 text address-text"
                        dir={isRtl ? "rtl" : "ltr"}
                        dangerouslySetInnerHTML={{
                          __html: data.contactSection.contactInfo.address.replace(/\n/g, "<br />"),
                        }}
                      />
                    </div>
                  </div>
                  <div className="box-contact-item style-bg-white">
                    <div className="icon wow fadeInUp" data-wow-delay=".2s">
                      <i className="icon-PhoneCall" />
                    </div>
                    <div className="content wow fadeInUp" data-wow-delay=".3s">
                      <div className="caption-1 title-section-contact">
                        {labels.phone}
                      </div>
                      <a href={`tel:${data.contactSection.contactInfo.phone}`} className="caption-1 text">
                        {data.contactSection.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                  <div className="box-contact-item style-bg-white">
                    <div className="icon wow fadeInUp" data-wow-delay=".4s">
                      <i className="icon-Envelope" />
                    </div>
                    <div className="content wow fadeInUp" data-wow-delay=".5s">
                      <div className="caption-1 title-section-contact">
                        {labels.email}
                      </div>
                      <div className="caption-1 text">
                        <a href={`mailto:${data.contactSection.contactInfo.email}`} className="caption-1 text">
                          {data.contactSection.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
