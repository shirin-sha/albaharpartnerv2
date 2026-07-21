import Link from "next/link";
import React from "react";
import { FAQsSection } from "@/types/aboutus";

interface Props {
  data: FAQsSection;
}

export default function FaqsCMS({ data }: Props) {
  if (!data.isActive) return null;

  return (
    <section
      className="section-faqs h-1 tf-spacing-2 section-one-page"
      id="faqs"
    >
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="section-faqs-inner">
              <div className="left">
                <div className="heading-section">
                  <div className="text-anime-wave">
                    <span className="tag label text-btn-uppercase bg-white">{data.tag}</span>
                  </div>
                  <h3 className="title-section mb-12 text-anime-wave">
                    {data.heading}
                  </h3>
                  <div className="sub-title body-2 text-anime-wave mb-40">
                    {data.subheading}
                  </div>
                  <div className="text-anime-wave">
                    <Link
                      href={data.buttonLink}
                      className="tf-btn style-1 bg-color-primary"
                    >
                      <span>{data.buttonText}</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="wg-according" id="According">
                  {data.faqs && data.faqs.map((faq, index) => (
                    <div key={index} className="according-item">
                      <h5>
                        <a
                          href={`#according-${index + 1}`}
                          data-bs-toggle="collapse"
                          className={`title-according ${index === 0 ? '' : 'collapsed'}`}
                        >
                          {faq.question} <span />
                        </a>
                      </h5>
                      <div
                        id={`according-${index + 1}`}
                        className={`collapse ${index === 0 ? 'show' : ''}`}
                        data-bs-parent="#According"
                      >
                        <div className="according-content">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </div>
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
