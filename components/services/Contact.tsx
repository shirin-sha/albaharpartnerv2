"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SolutionsDetailContact } from "@/types/solutions";
import { defaultSolutionsDetailPage } from "@/types/solutions";

type Props = {
  data?: Partial<SolutionsDetailContact> | null;
};

function normalizeList(value: string[] | undefined, fallback: string[]): string[] {
  const cleaned = (value || []).map((v) => v.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : fallback;
}

export default function Contact({ data }: Props) {
  const pathname = usePathname();
  const isRtl = pathname?.startsWith("/ar") || false;
  const defaults = defaultSolutionsDetailPage(isRtl ? "rtl" : "ltr").contact;

  const copy = {
    tag: data?.tag?.trim() || defaults.tag,
    title: data?.title?.trim() || defaults.title,
    subtitle: data?.subtitle?.trim() || defaults.subtitle,
    addressTitle: data?.addressTitle?.trim() || defaults.addressTitle,
    address: data?.address?.trim() || defaults.address,
    directionLabel: data?.directionLabel?.trim() || defaults.directionLabel,
    mapUrl: data?.mapUrl?.trim() || defaults.mapUrl,
    phoneTitle: data?.phoneTitle?.trim() || defaults.phoneTitle,
    phones: normalizeList(data?.phones, defaults.phones),
    emailTitle: data?.emailTitle?.trim() || defaults.emailTitle,
    emails: normalizeList(data?.emails, defaults.emails),
    ctaLabel: data?.ctaLabel?.trim() || defaults.ctaLabel,
    ctaHref: data?.ctaHref?.trim() || defaults.ctaHref,
  };

  const subtitleLines = copy.subtitle.split(/\n/).filter(Boolean);

  return (
    <div className="sidebar-contact sidebar-details">
      <div className="section-content position-relative">
        <div className="heading-section style-color-white">
          <span className="tag label text-btn-uppercase color-white mb-16">
            {copy.tag}
          </span>
          <h4 className="title-section mb-1">{copy.title}</h4>
          <div className="sub-title caption-1">
            {subtitleLines.map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 ? <br /> : null}
                {line}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="list-box-contact style-column mb-28">
          <div
            className="box-contact-item"
            style={isRtl ? { direction: "rtl", textAlign: "right" } : undefined}
          >
            <div className="icon">
              <i className="icon-MapPin" />
            </div>
            <div className="content" style={isRtl ? { width: "100%" } : undefined}>
              <div className="caption-1 title-section-contact">
                {copy.addressTitle}
              </div>
              <div
                className="caption-1 text"
                style={
                  isRtl
                    ? {
                        display: "block",
                        width: "100%",
                        textAlign: "right",
                        direction: "rtl",
                        unicodeBidi: "plaintext",
                        paddingInlineStart: 0,
                      }
                    : undefined
                }
              >
                {copy.address}
              </div>
              <a
                href={copy.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label text-btn-uppercase"
                style={isRtl ? { marginInlineStart: 0 } : undefined}
              >
                {copy.directionLabel}
              </a>
            </div>
          </div>
          <div className="box-contact-item">
            <div className="icon">
              <i className="icon-PhoneCall" />
            </div>
            <div className="content">
              <div className="caption-1 title-section-contact">
                {copy.phoneTitle}
              </div>
              <div className="caption-1 text">
                {copy.phones.map((phone, index) => (
                  <React.Fragment key={`${phone}-${index}`}>
                    {index > 0 ? <br /> : null}
                    <a href={`tel:${phone.replace(/\s+/g, "")}`}>
                      <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                        {phone}
                      </span>
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="box-contact-item">
            <div className="icon">
              <i className="icon-Envelope" />
            </div>
            <div className="content">
              <div className="caption-1 title-section-contact">
                {copy.emailTitle}
              </div>
              {copy.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="caption-1 text"
                >
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {email}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <Link
          href={copy.ctaHref}
          className="tf-btn style-1 bg-white bg-white-style-2 w-full text-center"
        >
          <span> {copy.ctaLabel} </span>
        </Link>
      </div>
    </div>
  );
}
