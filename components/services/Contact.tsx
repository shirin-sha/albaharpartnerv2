"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Contact() {
  const pathname = usePathname();
  const isRtl = pathname?.startsWith("/ar") || false;

  const copy = isRtl
    ? {
        tag: "اتصل بنا",
        title: "تواصل معنا",
        subtitleLine1: "تواصل معنا اليوم لمناقشة كيف يمكننا",
        subtitleLine2: "دعم أهداف عملك.",
        addressTitle: "عنوان الشركة",
        address:
          "ص.ب 148 الصفاة 13002 - الكويت، قطعة 1، شارع 3، الشويخ الصناعية 1",
        direction: "الاتجاهات",
        phoneTitle: "اتصل بنا",
        emailTitle: "راسلنا",
        cta: "اتصل بنا",
        ctaHref: "/ar/contact-us",
      }
    : {
        tag: "Contact US",
        title: "Get In Touch",
        subtitleLine1: "Reach out today to discuss how we can",
        subtitleLine2: "support your business goals.",
        addressTitle: "Address Business",
        address:
          "P.O.Box 148 Safat 13002 - Kuwait, Block 1, Street 3, Shuwaikh Industrial 1",
        direction: "Get direction",
        phoneTitle: "Contact Us",
        emailTitle: "Email Us",
        cta: "Contact Us",
        ctaHref: "/contact-us",
      };

  return (
    <>
      {" "}
   
      <div className="sidebar-contact sidebar-details">
        <div className="section-content position-relative">
          <div className="heading-section style-color-white">
            <span className="tag label text-btn-uppercase color-white mb-16">{copy.tag}</span>
            <h4 className="title-section mb-1">{copy.title}</h4>
            <div className="sub-title caption-1">
              {copy.subtitleLine1}
              <br />
              {copy.subtitleLine2}
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
                  href="https://maps.google.com/?q=Al+Bahar+and+Partners+Kuwait"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-btn-uppercase"
                  style={isRtl ? { marginInlineStart: 0 } : undefined}
                >
                  {copy.direction}
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
                <a href="tel:+9651848848" className="caption-1 text">
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    +965 184 8848
                  </span>
                  <br />
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    +965 184 8848
                  </span>
                </a>
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
                <a href="mailto:bpc.sales@albahargroup.com" className="caption-1 text">
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    bpc.sales@albahargroup.com
                  </span>
                </a>
              
                <a href="mailto:bpc.info@albahargroup.com" className="caption-1 text">
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    bpc.info@albahargroup.com
                  </span>
                </a>
              </div>
            </div>
          </div>
          <Link
            href={copy.ctaHref}
            className="tf-btn style-1 bg-white bg-white-style-2 w-full text-center"
          >
            <span> {copy.cta} </span>
          </Link>
        </div>
      </div>
    </>
  );
}
