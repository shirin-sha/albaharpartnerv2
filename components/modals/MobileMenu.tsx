"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HeaderContent, MenuItem } from "@/types/header";
import { addLanguagePrefix, getLanguageFromPathname } from "@/lib/language-utils";

function normalizePath(path: string) {
  return path.replace(/^\/ar/, "") || "/";
}

export default function MobileMenu() {
  const pathname = usePathname();
  const language = getLanguageFromPathname(pathname);
  const [header, setHeader] = useState<HeaderContent | null>(null);
  const [logoSrc, setLogoSrc] = useState("/image/logo/logo-2.png");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/header?language=${language}`);
        const json = await res.json();
        if (!cancelled && json.success && json.data) {
          setHeader(json.data as HeaderContent);
        }
      } catch (err) {
        console.error("Failed to load mobile menu header:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    setLogoSrc(header?.logo?.imagePath?.trim() || "/image/logo/logo-2.png");
  }, [header?.logo?.imagePath]);

  const isItemActive = (href: string) => {
    const current = normalizePath(pathname || "/");
    const target = normalizePath(href);
    return target === current || (target !== "/" && current.startsWith(`${target}/`));
  };

  const isParentActive = (item: MenuItem) =>
    Boolean(item.dropdownItems?.some((sub) => isItemActive(sub.href)));

  const menuItems = (header?.menuItems || [])
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      dropdownItems: Array.isArray(item.dropdownItems) ? item.dropdownItems : [],
    }));

  const buttonText = (header?.buttonText || "").trim();
  const buttonLink = (header?.buttonLink || "").trim();
  const showProfileButton = Boolean(buttonText && buttonLink && buttonLink !== "#");
  const isFileDownload =
    /\.(pdf|docx?|xlsx?|zip)(\?|$)/i.test(buttonLink) ||
    buttonLink.includes("/files/") ||
    buttonLink.includes("/api/uploads/");
  const downloadHref = isFileDownload
    ? buttonLink.includes("?")
      ? `${buttonLink}&download=1`
      : `${buttonLink}?download=1`
    : buttonLink;

  const logoAlt = header?.logo?.alt || "Al Bahar & Partners";
  const homeHref = addLanguagePrefix(header?.logo?.link || "/", pathname);

  const contactLabel = language === "rtl" ? "معلومات التواصل" : "Contact Info";
  const locationLabel =
    language === "rtl" ? "الكويت" : "Kuwait City, Kuwait";
  const phoneDisplay = "+965 184 8848";
  const emailDisplay = "bpc.info@albahargroup.com";

  return (
    <div className="offcanvas offcanvas-start mobile-nav-wrap" id="canvasMobile">
      <div className="inner-mobile-nav">
        <div className="top-header-mobi">
          <div className="logo-mobile">
            <Link href={homeHref}>
              <span className="visually-hidden">{`${logoAlt} — home`}</span>
              <Image
                alt=""
                src={logoSrc}
                width={169}
                height={40}
                onError={() => {
                  if (logoSrc !== "/image/logo/logo-2.png") {
                    setLogoSrc("/image/logo/logo-2.png");
                  }
                }}
              />
            </Link>
          </div>
          <button
            className="mobile-nav-close"
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              const el = document.getElementById("canvasMobile");
              el?.classList.remove("show");
              if (el) {
                el.style.visibility = "";
                el.setAttribute("aria-hidden", "true");
              }
              document.body.classList.remove("overflow-hidden");
              document.querySelectorAll(".mobile-nav-backdrop").forEach((b) => b.remove());
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              width="20px"
              height="20px"
              viewBox="0 0 122.878 122.88"
              aria-hidden
            >
              <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
            </svg>
          </button>
        </div>

        <nav className="mobile-main-nav">
          <ul id="menu-mobile" className="menu">
            {menuItems.map((item, index) => {
              const itemHref = addLanguagePrefix(item.href, pathname);
              const dropdownId = `dropdown-menu-mobile-${index}`;
              const activeChildren =
                item.dropdownItems
                  ?.filter((sub) => sub.isActive)
                  .sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

              if (item.hasDropdown && activeChildren.length > 0) {
                return (
                  <li
                    key={item._id || `${item.href}-${index}`}
                    className={`menu-item menu-item-has-children-mobile ${
                      isParentActive(item) || isItemActive(item.href)
                        ? "current-menu-mobile-item"
                        : ""
                    }`}
                  >
                    <a
                      href={`#${dropdownId}`}
                      data-bs-toggle="collapse"
                      className="collapsed"
                    >
                      {item.title}
                    </a>
                    <div
                      id={dropdownId}
                      className="collapse"
                      data-bs-parent="#menu-mobile"
                    >
                      <ul className="sub-menu-mobile">
                        {activeChildren.map((sub, subIndex) => (
                          <li
                            key={sub._id || `${sub.href}-${subIndex}`}
                            className={`menu-item ${
                              isItemActive(sub.href) ? "current-menu-mobile-item" : ""
                            }`}
                          >
                            <Link
                              href={addLanguagePrefix(sub.href, pathname)}
                              prefetch={true}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li
                  key={item._id || `${item.href}-${index}`}
                  className={`menu-item ${
                    isItemActive(item.href) ? "current-menu-mobile-item" : ""
                  }`}
                >
                  <Link href={itemHref} prefetch={true}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          {showProfileButton && (
            <div className="mobile-profile-cta">
              {isFileDownload ? (
                <a
                  href={downloadHref}
                  className="tf-btn style-1 bg-color-primary"
                  download
                >
                  <span>{buttonText}</span>
                  <svg
                    className="header-download-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M12 3v12m0 0l4-4m-4 4l-4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 19h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              ) : (
                <Link
                  href={addLanguagePrefix(buttonLink, pathname)}
                  className="tf-btn style-1 bg-color-primary"
                >
                  <span>{buttonText}</span>
                </Link>
              )}
            </div>
          )}

          <div className="contact-mobile">
            <h6 className="title-contact-mobile">{contactLabel}</h6>
            <div className="content-contact-moblile">
              <a
                href="https://maps.app.goo.gl/A1NYpV7HUB2gmMGW6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="icon-MapPin" /> {locationLabel}
              </a>
            </div>
            <div className="content-contact-moblile">
              <a href={`mailto:${emailDisplay}`}>
                <i className="icon-Envelope" /> {emailDisplay}
              </a>
            </div>
            <div className="content-contact-moblile">
              <a href="tel:+9651848848" dir="ltr">
                <i className="icon-PhoneCall" /> {phoneDisplay}
              </a>
            </div>
            <div className="content-contact-moblile">
              <ul className="tf-social style-border radius-50 g-8 style-2 color-on-suface-container">
                <li className="item">
                  <a
                    href="https://www.linkedin.com/company/bahar-and-partners/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Al Bahar & Partners on LinkedIn"
                  >
                    <span className="visually-hidden">Al Bahar & Partners on LinkedIn</span>
                    <div className="icon" aria-hidden>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M3.784 2.167A1.667 1.667 0 1 1 .45 2.166a1.667 1.667 0 0 1 3.334.001m.05 2.9H.5v10.434h3.334zm5.266 0H5.784v10.434h3.283v-5.475c0-3.05 3.975-3.334 3.975 0V15.5h3.292V8.892c0-5.141-5.884-4.95-7.267-2.425z" />
                      </svg>
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a
                    href="https://www.instagram.com/albaharandpartnersco/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Al Bahar & Partners on Instagram"
                  >
                    <span className="visually-hidden">Al Bahar & Partners on Instagram</span>
                    <div className="icon" aria-hidden>
                      <i className="icon-ig1" />
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
