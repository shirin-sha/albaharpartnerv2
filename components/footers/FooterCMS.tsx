"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import { FooterContent } from "@/types/footer";
import NewsLetterForm from "../common/NewsLetterForm";

interface Props {
  data: FooterContent;
  parentClass?: string;
  light?: boolean;
}

export default function FooterCMS({ data, parentClass = "footer style-2", light = false }: Props) {
  useEffect(() => {
    const headings = document.querySelectorAll(".title-mobile");

    const toggleOpen = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const parent = target.closest(".footer-col-block") as HTMLElement | null;
      if (!parent) return;
      const content = parent.querySelector(
        ".tf-collapse-content"
      ) as HTMLElement | null;
      if (!content) return;

      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
        content.style.height = "0px";
      } else {
        parent.classList.add("open");
        content.style.height = content.scrollHeight + 10 + "px";
      }
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []);

  if (!data.isActive) return null;

  const activeSocialLinks = (data.socialLinks || [])
    .filter(link => link.isActive)
    .sort((a, b) => a.order - b.order);

  const activeQuickLinks = (data.quickLinks || [])
    .filter(col => col.isActive)
    .sort((a, b) => a.order - b.order);
  const quickLinkColumnsForDisplay = (() => {
    if (activeQuickLinks.length === 0) return [];

    const normalizedColumns = activeQuickLinks
      .map((column) => ({
        ...column,
        links: (column.links || [])
          .filter((link) => link.isActive)
          .sort((a, b) => a.order - b.order),
      }))
      .filter((column) => column.links.length > 0);

    if (normalizedColumns.length === 0) return [];

    // Keep previous visual behavior: if CMS has one column, render as two balanced columns.
    if (normalizedColumns.length === 1) {
      const links = normalizedColumns[0].links;
      if (links.length <= 1) return normalizedColumns;

      const splitIndex = Math.ceil(links.length / 2);
      return [
        { ...normalizedColumns[0], links: links.slice(0, splitIndex) },
        { ...normalizedColumns[0], links: links.slice(splitIndex) },
      ].filter((column) => column.links.length > 0);
    }

    return normalizedColumns;
  })();

  const activeServiceItems = (data.serviceAssistance?.items || [])
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order);

  const activeContactItems = (data.contactSection?.items || [])
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order);

  const activeBottomLinks = (data.footerBottom?.links || [])
    .filter((link) => link.isActive)
    .filter((link) => {
      const href = (link.href || "").replace(/\/+$/, "").toLowerCase();
      const title = (link.title || "").trim().toLowerCase();
      // Support link removed from footer bottom on all viewports
      if (href === "/support" || href.endsWith("/support")) return false;
      if (title === "support" || title === "الدعم") return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  const renderSocialIcon = (icon: string) => {
    const key = (icon || "").toLowerCase().replace(/^icon-/, "");

    if (key === "linkedin") {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.784 2.167A1.667 1.667 0 1 1 .45 2.166a1.667 1.667 0 0 1 3.334.001m.05 2.9H.5v10.434h3.334zm5.266 0H5.784v10.434h3.283v-5.475c0-3.05 3.975-3.334 3.975 0V15.5h3.292V8.892c0-5.141-5.884-4.95-7.267-2.425z"/>
        </svg>
      );
    }
    if (key === "instagram" || key === "ig1") {
      return <i className="icon-ig1" />;
    }
    if (key === "facebook") {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.666 10.255H8.75l.833-3.333H6.666V5.255c0-.858 0-1.666 1.667-1.666h1.25v-2.8a23 23 0 0 0-2.38-.117c-2.263 0-3.87 1.38-3.87 3.916v2.334h-2.5v3.333h2.5v7.083h3.333z"/>
        </svg>
      );
    }
    if (key === "x" || key === "twitter") {
      return <i className="icon-x" />;
    }
    return <i className={icon} />;
  };

  const footerSocialLinkLabel = (icon: string) => {
    const key = (icon || "").toLowerCase().replace(/^icon-/, "");
    switch (key) {
      case "linkedin":
        return "Al Bahar & Partners on LinkedIn";
      case "facebook":
        return "Al Bahar & Partners on Facebook";
      case "instagram":
      case "ig1":
        return "Al Bahar & Partners on Instagram";
      case "x":
      case "twitter":
        return "Al Bahar & Partners on X";
      default:
        return `Al Bahar & Partners social profile (${icon?.trim() || "external link"})`;
    }
  };

  const getContactItemHref = (item: { value: string }) => {
    const trimmed = (item.value || "").trim();
    if (!trimmed) return "";
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) return `mailto:${trimmed}`;
    if (/^\+?[0-9()\-\s]{7,}$/.test(trimmed)) return `tel:${trimmed.replace(/\s+/g, "")}`;
    return "";
  };

  const isLtrContactValue = (value: string) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return false;
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) return true;
    if (/^\+?[0-9()\-\s]{7,}$/.test(trimmed)) return true;
    return false;
  };

  const renderContactValue = (value: string) => {
    if (!isLtrContactValue(value)) return value;
    return (
      <span dir="ltr" className="ltr-inline">
        {value}
      </span>
    );
  };

  const renderContactItemContent = (item: { label: string; value: string }) => (
    <>
      {item.label ? `${item.label}: ` : null}
      {renderContactValue(item.value)}
    </>
  );

  return (
    <footer className={parentClass} id="footer">
      <div className="tf-container position-relative z-5">
        <div className="row">
          <div className="col-12">
            <div className="footer-top">
              <div className="footer-left">
                <div className="logo-footer">
                  <Link href={data.logo.link} className="logo">
                    <span className="visually-hidden">
                      {(data.logo.alt || "").trim()
                        ? `${data.logo.alt} — home`
                        : "Al Bahar & Partners — home"}
                    </span>
                    <Image
                      alt=""
                      src={data.logo.imagePath}
                      width={data.logo.width}
                      height={data.logo.height}
                    />
                  </Link>
                </div>
                {data.description && (
                  <div className="text caption-1">
                    {data.description}
                  </div>
                )}
                {activeSocialLinks.length > 0 && (
                  <div className="footer-social">
                    <div className="title-footer">Follow Us:</div>
                    <ul
                      className={`tf-social style-border radius-50 g-8 style-2 ${
                        light ? "color-on-suface-container" : ""
                      }`}
                    >
                      {activeSocialLinks.map((social, index) => (
                        <li key={social._id || index} className="item">
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={footerSocialLinkLabel(social.icon)}
                          >
                            <span className="visually-hidden">
                              {footerSocialLinkLabel(social.icon)}
                            </span>
                            <div className="icon" aria-hidden={true}>
                              {renderSocialIcon(social.icon)}
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="footer-right">
                {data.newsletter.isActive && (
                  <div className="footer-subscribe">
                    <h4 className={light ? "" : "color-white"}>
                      {data.newsletter.title}
                    </h4>
                    <div className="footer-subscribe-content">
                      <NewsLetterForm placeholder={data.newsletter.placeholder} />
                      {data.newsletter.description && (
                        <div className="text caption-2">
                          {data.newsletter.description}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="footer-center">
                  {quickLinkColumnsForDisplay.length > 0 && (
                    <div className="footer-content our-services footer-col-block quick-links">
                      <div className="title-mobile label text-btn-uppercase">
                        {activeQuickLinks[0]?.title || 'Quick Links'}
                        <i className="icon-arrow-51" />
                      </div>
                      <div className="tf-collapse-content">
                        <div className="flex g-12">
                          {quickLinkColumnsForDisplay.map((column, colIndex) => {
                            return (
                              <ul key={column._id || colIndex}>
                                {column.links.map((link, linkIndex) => (
                                  <li key={link._id || linkIndex} className="support-item-footer caption-1">
                                    <Link href={link.href}>{link.title}</Link>
                                  </li>
                                ))}
                              </ul>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {data.serviceAssistance.isActive && activeServiceItems.length > 0 && (
                    <div className="footer-content footer-col-block">
                      <div className="title-mobile label text-btn-uppercase mb-12">
                        {data.serviceAssistance.title}
                        <i className="icon-arrow-51" />
                      </div>
                      <div className="tf-collapse-content">
                        <ul>
                          {activeServiceItems.map((item, index) => (
                            <li key={item._id || index} className="support-item-footer caption-1">
                              {getContactItemHref(item) ? (
                                <Link href={getContactItemHref(item)}>
                                  {renderContactItemContent(item)}
                                </Link>
                              ) : (
                                <span>
                                  {renderContactItemContent(item)}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {data.contactSection.isActive && activeContactItems.length > 0 && (
                    <div className="footer-content footer-contact footer-col-block contact-footer">
                      <div className="title-mobile label text-btn-uppercase">
                        {data.contactSection.title}
                        <i className="icon-arrow-51" />
                      </div>
                      <div className="tf-collapse-content">
                        <ul>
                          {activeContactItems.map((item, index) => (
                            <li key={item._id || index} className="support-item-footer caption-1">
                              {getContactItemHref(item) ? (
                                <Link href={getContactItemHref(item)}>
                                  {renderContactItemContent(item)}
                                </Link>
                              ) : (
                                <span>
                                  {renderContactItemContent(item)}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="footer-bottom-inner">
                <div className="left">
                  <div className="text caption-1">
                    {data.footerBottom.copyright}
                  </div>
                </div>
                {activeBottomLinks.length > 0 && (
                  <div className="right">
                    <ul>
                      {activeBottomLinks.map((link, index) => (
                        <li key={link._id || index}>
                          <Link href={link.href} className="caption-1">
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {data.backgroundImage && (
        <div className="image img-item">
          <Image
            src={data.backgroundImage}
            alt=""
            className="lazyload"
            width={846}
            height={423}
          />
        </div>
      )}
    </footer>
  );
}
