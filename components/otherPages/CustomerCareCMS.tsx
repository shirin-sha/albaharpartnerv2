import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CustomerCareContent } from "@/types/customer-care-center";

interface Props {
  data: CustomerCareContent;
  language?: "ltr" | "rtl";
}

function phoneHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

function emailHref(value: string) {
  return `mailto:${value}`;
}

export default function CustomerCareCMS({ data, language = "ltr" }: Props) {
  const services = (data.servicesSection.services || [])
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order);

  const steps = (data.processSection.steps || [])
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order);

  const primaryHref =
    language === "rtl" &&
    data.ctaSection.primaryButtonLink.startsWith("/") &&
    !data.ctaSection.primaryButtonLink.startsWith("/ar")
      ? `/ar${data.ctaSection.primaryButtonLink}`
      : data.ctaSection.primaryButtonLink;

  return (
    <div className="section-ccc" dir={language}>
      {data.infoBar.isActive && data.infoBar.items?.length > 0 && (
        <div className="ccc-info-bar">
          <div className="tf-container">
            <div className="ccc-info-grid">
              {data.infoBar.items.map((item, index) => {
                const isPhone = /call|phone|اتصل/i.test(item.label);
                const isEmail = /email|mail|بريد/i.test(item.label);
                const valueNode = isPhone ? (
                  <a href={phoneHref(item.value)} className="ccc-info-value" dir="ltr">
                    {item.value}
                  </a>
                ) : isEmail ? (
                  <a href={emailHref(item.value)} className="ccc-info-value" dir="ltr">
                    {item.value}
                  </a>
                ) : (
                  <span className="ccc-info-value">{item.value}</span>
                );

                return (
                  <div className="ccc-info-item" key={`${item.label}-${index}`}>
                    <div className="ccc-info-icon">
                      <i className={item.iconClass || "icon-MapPin"} aria-hidden />
                    </div>
                    <div>
                      <span className="ccc-info-label text-btn-uppercase">{item.label}</span>
                      {valueNode}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {data.overviewSection.isActive && (
        <section className="ccc-overview tf-spacing-2">
          <div className="tf-container">
            <div className="row align-items-center rg-40">
              <div className="col-lg-6">
                <div className="heading-section mb-0">
                  <div className="text-anime-wave-1">
                    <span className="tag label text-btn-uppercase">
                      {data.overviewSection.tag}
                    </span>
                  </div>
                  <h3 className="title-section text-anime-wave-1 mb-16">
                    {data.overviewSection.heading}
                  </h3>
                  <p className="sub-title body-2 color-on-suface-container mb-0">
                    {data.overviewSection.description}
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                {data.overviewSection.imagePath && (
                  <div className="ccc-media">
                    <Image
                      src={data.overviewSection.imagePath}
                      alt={data.overviewSection.heading}
                      width={720}
                      height={480}
                      className="lazyload"
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 991px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {data.servicesSection.isActive && services.length > 0 && (
        <section className="ccc-services tf-spacing-2 bg-surface">
          <div className="tf-container">
            <div className="heading-section text-center">
              <div className="text-anime-wave-1">
                <span className="tag label text-btn-uppercase">
                  {data.servicesSection.tag}
                </span>
              </div>
              <h3 className="title-section text-anime-wave-1 mb-0">
                {data.servicesSection.heading}
              </h3>
            </div>
            <div className="row rg-30">
              {services.map((service, index) => (
                <div className="col-lg-4 col-md-6" key={service._id || index}>
                  <div className="ccc-service-card">
                    <div className="ccc-service-icon">
                      <i className={service.iconClass || "icon-Briefcase"} aria-hidden />
                    </div>
                    <h6 className="ccc-service-title">{service.title}</h6>
                    <p className="ccc-service-desc body-2 mb-0">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.processSection.isActive && steps.length > 0 && (
        <section className="ccc-process tf-spacing-2">
          <div className="tf-container">
            <div className="heading-section text-center">
              <div className="text-anime-wave-1">
                <span className="tag label text-btn-uppercase">
                  {data.processSection.tag}
                </span>
              </div>
              <h3 className="title-section text-anime-wave-1 mb-0">
                {data.processSection.heading}
              </h3>
            </div>
            <div className="ccc-process-track">
              {steps.map((step, index) => (
                <div className="ccc-process-step" key={step._id || index}>
                  <div className="ccc-process-number">{index + 1}</div>
                  <div className="ccc-process-icon">
                    <i className={step.iconClass || "icon-CheckCircle"} aria-hidden />
                  </div>
                  <h6 className="ccc-process-title">{step.title}</h6>
                  <p className="ccc-process-desc caption-1 mb-0">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.whySection.isActive && (
        <section className="ccc-why tf-spacing-2 bg-surface">
          <div className="tf-container">
            <div className="row align-items-center rg-40">
              <div className="col-lg-6">
                {data.whySection.imagePath && (
                  <div className="ccc-media">
                    <Image
                      src={data.whySection.imagePath}
                      alt={data.whySection.heading}
                      width={720}
                      height={480}
                      className="lazyload"
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 991px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
              <div className="col-lg-6">
                <div className="heading-section mb-0">
                  <div className="text-anime-wave-1">
                    <span className="tag label text-btn-uppercase">
                      {data.whySection.tag}
                    </span>
                  </div>
                  <h3 className="title-section text-anime-wave-1 mb-24">
                    {data.whySection.heading}
                  </h3>
                  <ul className="ccc-benefits">
                    {(data.whySection.benefits || []).map((benefit, index) => (
                      <li key={index}>
                        <i className="icon-checkbox" aria-hidden />
                        <span>{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {data.visitSection.isActive && (
        <section className="ccc-visit tf-spacing-2">
          <div className="tf-container">
            <div className="row rg-40">
              <div className="col-lg-6">
                <div className="heading-section mb-20">
                  <div className="text-anime-wave-1">
                    <span className="tag label text-btn-uppercase">
                      {data.visitSection.tag}
                    </span>
                  </div>
                </div>
                <div className="ccc-map">
                  {data.visitSection.mapEmbedUrl ? (
                    <iframe
                      title={data.visitSection.locationValue}
                      src={data.visitSection.mapEmbedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  ) : (
                    <div className="ccc-map-fallback">
                      <i className="icon-MapPin" aria-hidden />
                      <span>{data.visitSection.locationValue}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="ccc-visit-details">
                  <div className="ccc-visit-row">
                    <i className="icon-MapPin" aria-hidden />
                    <div>
                      <span className="ccc-info-label text-btn-uppercase">
                        {data.visitSection.locationLabel}
                      </span>
                      <p className="mb-0">{data.visitSection.locationValue}</p>
                    </div>
                  </div>
                  <div className="ccc-visit-row">
                    <i className="icon-timer" aria-hidden />
                    <div>
                      <span className="ccc-info-label text-btn-uppercase">
                        {data.visitSection.hoursLabel}
                      </span>
                      <p className="mb-0">{data.visitSection.hoursValue}</p>
                    </div>
                  </div>
                  <div className="ccc-visit-row">
                    <i className="icon-PhoneCall" aria-hidden />
                    <div>
                      <span className="ccc-info-label text-btn-uppercase">
                        {data.visitSection.callLabel}
                      </span>
                      <a
                        href={phoneHref(data.visitSection.callValue)}
                        className="ccc-info-value"
                        dir="ltr"
                      >
                        {data.visitSection.callValue}
                      </a>
                    </div>
                  </div>
                  <div className="ccc-visit-row">
                    <i className="icon-Envelope" aria-hidden />
                    <div>
                      <span className="ccc-info-label text-btn-uppercase">
                        {data.visitSection.emailLabel}
                      </span>
                      <a
                        href={emailHref(data.visitSection.emailValue)}
                        className="ccc-info-value"
                        dir="ltr"
                      >
                        {data.visitSection.emailValue}
                      </a>
                    </div>
                  </div>
                  <Link
                    href={data.visitSection.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tf-btn style-1 bg-color-primary ccc-directions-btn"
                  >
                    <span>{data.visitSection.directionsText}</span>
                    <i className="icon-MapPin" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {data.ctaSection.isActive && (
        <section className="ccc-cta">
          <div className="tf-container">
            <div className="ccc-cta-inner">
              <div className="heading-section style-color-white mb-0">
                <h3 className="title-section mb-12">{data.ctaSection.heading}</h3>
                <p className="sub-title body-2 mb-0">{data.ctaSection.subheading}</p>
              </div>
              <div className="ccc-cta-actions">
                <Link href={primaryHref} className="tf-btn style-1 bg-color-primary">
                  <span>{data.ctaSection.primaryButtonText}</span>
                </Link>
                <a
                  href={data.ctaSection.secondaryButtonLink}
                  className="tf-btn style-1 ccc-cta-ghost"
                >
                  <span>{data.ctaSection.secondaryButtonText}</span>
                  <i className="icon-PhoneCall" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
