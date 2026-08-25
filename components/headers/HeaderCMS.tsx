"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { HeaderContent } from "@/types/header";
import { usePathname } from "next/navigation";
import { addLanguagePrefix } from "@/lib/language-utils";

interface Props {
  data: HeaderContent;
}

export default function HeaderCMS({ data }: Props) {
  const [isFixed, setIsFixed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 56) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!data.isActive) return null;

  const activeMenuItems = (data.menuItems || [])
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  const isMenuActive = (href: string) => {
    const languageAwareHref = addLanguagePrefix(href, pathname);
    const currentPath = pathname?.replace(/^\/ar/, "") || "/";
    const hrefPath = languageAwareHref?.replace(/^\/ar/, "") || "/";
    return hrefPath === currentPath || (hrefPath === "/" && currentPath === "/");
  };

  const isMenuParentActive = (item: (typeof activeMenuItems)[0]) => {
    if (!item.hasDropdown || !item.dropdownItems) return false;
    return item.dropdownItems.some((subItem) => isMenuActive(subItem.href));
  };

  const buttonText = (data.buttonText || "").trim();
  const buttonLink = (data.buttonLink || "").trim();
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

  return (
    <header
      className={`header style-1 style-absolute header-fixed header-centered-nav ${
        isFixed ? "is-fixed" : ""
      } `}
      id="header"
    >
      <div className="tf-container w-1870">
        <div className="row">
          <div className="col-12">
            <div className="header-content">
              <div className="header-left">
                <div className="logo">
                  <Link href={addLanguagePrefix(data.logo.link, pathname)}>
                    <span className="visually-hidden">
                      {(data.logo.alt || "").trim()
                        ? `${data.logo.alt} — home`
                        : "Al Bahar & Partners — home"}
                    </span>
                    <Image
                      alt=""
                      src={data.logo.imagePath}
                      width={data.logo.width || 169}
                      height={data.logo.height || 40}
                      style={{ height: "40px", width: "auto" }}
                    />
                  </Link>
                </div>
              </div>

              <nav className="main-menu header-center-nav">
                <ul className="menu-primary-menu">
                  {activeMenuItems.map((item, index) => {
                    const hasActiveDropdown = isMenuParentActive(item);
                    const isActive = isMenuActive(item.href);

                    if (item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0) {
                      const activeDropdownItems = item.dropdownItems
                        .filter((subItem) => subItem.isActive)
                        .sort((a, b) => (a.order || 0) - (b.order || 0));

                      return (
                        <li
                          key={item._id || index}
                          className={`menu-item menu-item-has-children position-relative ${
                            hasActiveDropdown || isActive ? "current-menu-item" : ""
                          }`}
                        >
                          <Link
                            href={addLanguagePrefix(item.href, pathname)}
                            className="item-link"
                            prefetch={true}
                          >
                            {item.title}
                          </Link>
                          <ul className="sub-menu">
                            {activeDropdownItems.map((subItem, subIndex) => (
                              <li
                                key={subItem._id || subIndex}
                                className={`sub-menu-item ${
                                  isMenuActive(subItem.href) ? "current-item" : ""
                                }`}
                              >
                                <Link
                                  href={addLanguagePrefix(subItem.href, pathname)}
                                  className="item-link-2"
                                  prefetch={true}
                                >
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    }

                    return (
                      <li
                        key={item._id || index}
                        className={`menu-item ${isActive ? "current-menu-item" : ""}`}
                      >
                        <Link
                          href={addLanguagePrefix(item.href, pathname)}
                          className="item-link"
                          prefetch={true}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="header-right">
                {showProfileButton && (
                  <div className="header-actions-tight">
                    <div className="nav-btn">
                      {isFileDownload ? (
                        <a
                          href={downloadHref}
                          className="tf-btn bg-white style-1 hover-bg-primary header-profile-btn"
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
                          className="tf-btn bg-white style-1 hover-bg-primary header-profile-btn"
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
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                <div className="nav-icon">
                  <div className="mobile-button">
                    <a href="#canvasMobile" data-bs-toggle="offcanvas" aria-label="Open mobile menu">
                      <span className="visually-hidden">Open mobile menu</span>
                      <span />
                      <span />
                      <span />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
