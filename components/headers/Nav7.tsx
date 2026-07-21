"use client";
import Link from "next/link";
import React from "react";
import { solutionsLinks, corpInfoLinks } from "@/data/menu";
import { usePathname } from "next/navigation";
import { MenuLink } from "@/types/menuLink";

export default function Nav7() {
  const pathname = usePathname();
  
  const isMenuActive = (link: MenuLink) => {
    const currentPath = pathname?.split("/")[1];
    const hrefPath = link.href?.split("/")[1];
    return hrefPath === currentPath;
  };

  const isMenuParentActive = (menu: MenuLink[]) => {
    return menu.some((elm) => isMenuActive(elm));
  };

  return (
    <>
      <li
        className={`menu-item ${
          pathname === "/" ? "current-menu-item" : ""
        }`}
      >
        <Link href="/" className="item-link" prefetch={true}>
          HOME
        </Link>
      </li>
      <li
        className={`menu-item ${
          isMenuActive({ href: "/about-us" }) ? "current-menu-item" : ""
        }`}
      >
        <Link href="/about-us" className="item-link" prefetch={true}>
          ABOUT US
        </Link>
      </li>
      <li
        className={`menu-item menu-item-has-children position-relative ${
          isMenuParentActive(solutionsLinks) ? "current-menu-item" : ""
        }`}
      >
        <Link href="/solutions" className="item-link" prefetch={true}>
          SOLUTIONS
        </Link>
        <ul className="sub-menu">
          {solutionsLinks.map((item, index) => (
            <li
              className={`sub-menu-item ${
                isMenuActive(item) ? "current-item" : ""
              }`}
              key={index}
            >
              <Link href={item.href} className="item-link-2" prefetch={true}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li
        className={`menu-item ${
          isMenuActive({ href: "/brands" }) ? "current-menu-item" : ""
        }`}
      >
        <Link href="/brands" className="item-link" prefetch={true}>
          BRANDS
        </Link>
      </li>
      <li
        className={`menu-item menu-item-has-children position-relative ${
          isMenuParentActive(corpInfoLinks) ? "current-menu-item" : ""
        }`}
      >
        <span className="item-link" role="button" aria-haspopup="true">
          CORP. INFORMATION
        </span>
        <ul className="sub-menu">
          {corpInfoLinks.map((item, index) => (
            <li
              className={`sub-menu-item ${
                isMenuActive(item) ? "current-item" : ""
              }`}
              key={index}
            >
              <Link href={item.href} className="item-link-2" prefetch={true}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li
        className={`menu-item ${
          isMenuActive({ href: "/support" }) ? "current-menu-item" : ""
        }`}
      >
        <Link href="/support" className="item-link" prefetch={true}>
          SUPPORT
        </Link>
      </li>
      <li
        className={`menu-item ${
          isMenuActive({ href: "/contact-us" }) ? "current-menu-item" : ""
        }`}
      >
        <Link href="/contact-us" className="item-link" prefetch={true}>
          CONTACT US
        </Link>
      </li>
    </>
  );
}

