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
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order);

  const isMenuActive = (href: string) => {
    const languageAwareHref = addLanguagePrefix(href, pathname);
    const currentPath = pathname?.replace(/^\/ar/, '') || '/';
    const hrefPath = languageAwareHref?.replace(/^\/ar/, '') || '/';
    return hrefPath === currentPath || (hrefPath === '/' && currentPath === '/');
  };

  const isMenuParentActive = (item: typeof activeMenuItems[0]) => {
    if (!item.hasDropdown || !item.dropdownItems) return false;
    return item.dropdownItems.some((subItem) => isMenuActive(subItem.href));
  };

  return (
    <header
      className={`header style-1 style-absolute header-fixed ${
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
                      width={data.logo.width}
                      height={40}
                      style={{ height: '40px', width: 'auto' }}
                    />
                  </Link>
                </div>
                <nav className="main-menu">
                  <ul className="menu-primary-menu">
                    {activeMenuItems.map((item, index) => {
                      const hasActiveDropdown = isMenuParentActive(item);
                      const isActive = isMenuActive(item.href);

                      if (item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0) {
                        const activeDropdownItems = item.dropdownItems
                          .filter(subItem => subItem.isActive)
                          .sort((a, b) => (a.order || 0) - (b.order || 0));

                        return (
                          <li
                            key={item._id || index}
                            className={`menu-item menu-item-has-children position-relative ${
                              hasActiveDropdown || isActive ? "current-menu-item" : ""
                            }`}
                          >
                            <Link href={addLanguagePrefix(item.href, pathname)} className="item-link" prefetch={true}>
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
                                  <Link href={addLanguagePrefix(subItem.href, pathname)} className="item-link-2" prefetch={true}>
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
                          <Link href={addLanguagePrefix(item.href, pathname)} className="item-link" prefetch={true}>
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
              <div className="header-right">
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
