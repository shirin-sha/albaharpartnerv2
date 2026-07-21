"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  solutionsLinks,
  corpInfoLinks,
} from "@/data/menu";
import { usePathname } from "next/navigation";
import { MenuLink } from "@/types/menuLink";

export default function MobileMenu() {
  const pathname = usePathname();
  const isMenuActive = (link: MenuLink) => {
    return link.href?.split("/")[1] == pathname.split("/")[1];
  };
  const isMenuParentActive = (menu: MenuLink[]) => {
    return menu.some((elm) => isMenuActive(elm));
  };
  return (
    <div
      className="offcanvas offcanvas-start mobile-nav-wrap"
      id="canvasMobile"
    >
      <div className="inner-mobile-nav">
        <div className="top-header-mobi">
          <div className="logo-mobile">
            <Link href={`/`}>
              <span className="visually-hidden">
                Al Bahar & Partners — home
              </span>
              <Image alt="" src="/image/logo/logo-2.png" width={169} height={40} />
            </Link>
          </div>
          <button
            className="mobile-nav-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="black"
              x="0px"
              y="0px"
              width="20px"
              height="20px"
              viewBox="0 0 122.878 122.88"
              enableBackground="new 0 0 122.878 122.88"
              xmlSpace="preserve"
            >
              <g>
                <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
              </g>
            </svg>
          </button>
        </div>
        <nav className="mobile-main-nav">
          <ul id="menu-mobile" className="menu">
            <li
                      className={`menu-item ${
                pathname === "/" ? "current-menu-mobile-item" : ""
              }`}
                    >
              <Link href="/" prefetch={true}>HOME</Link>
            </li>
            <li
              className={`menu-item ${
                isMenuActive({ href: "/about-us" })
                  ? "current-menu-mobile-item"
                  : ""
              }`}
                    >
              <Link href="/about-us" prefetch={true}>ABOUT US</Link>
            </li>
            <li
              className={`menu-item ${
                isMenuActive({ href: "/solutions" })
                  ? "current-menu-mobile-item"
                  : ""
              }`}
                    >
              <Link href="/solutions" prefetch={true}>SOLUTIONS</Link>
            </li>
            <li
                      className={`menu-item ${
                isMenuActive({ href: "/brands" })
                  ? "current-menu-mobile-item"
                  : ""
              }`}
                    >
              <Link href="/brands" prefetch={true}>BRANDS</Link>
            </li>
            <li
              className={`menu-item menu-item-has-children-mobile ${
                isMenuParentActive(corpInfoLinks)
                  ? "current-menu-mobile-item"
                  : ""
              }`}
            >
              <a
                href="#dropdown-menu-corp"
                data-bs-toggle="collapse"
                className="collapsed"
              >
                CORP. INFORMATION
              </a>
              <div
                id="dropdown-menu-corp"
                className="collapse"
                data-bs-parent="#menu-mobile"
              >
                <ul className="sub-menu-mobile">
                  {corpInfoLinks.map((link, i) => (
                    <li
                      key={i}
                      className={`menu-item ${
                        isMenuActive(link) ? "current-menu-mobile-item" : ""
                      }`}
                    >
                      <Link href={link.href} prefetch={true}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li
              className={`menu-item ${
                isMenuActive({ href: "/support" })
                  ? "current-menu-mobile-item"
                  : ""
              }`}
            >
              <Link href="/support" prefetch={true}>SUPPORT</Link>
            </li>
            <li
              className={`menu-item ${
                isMenuActive({ href: "/contact-us" })
                  ? "current-menu-mobile-item"
                  : ""
              }`}
            >
              <Link href="/contact-us" prefetch={true}>CONTACT US</Link>
            </li>
          </ul>
          <div className="contact-mobile">
            <h6 className="title-contact-mobile">Contact Info</h6>
            <div className="content-contact-moblile">
              <a href="https://maps.google.com/?q=East+Chicago+IN" target="_blank" rel="noopener noreferrer">
                <i className="icon-MapPin" /> 101 E 129th St, East Chicago, IN
                46312, US
              </a>
            </div>
            <div className="content-contact-moblile">
              <a href="mailto:example@gmail.com">
                <i className="icon-Envelope" /> example@gmail.com
              </a>
            </div>
            <div className="content-contact-moblile">
              <a href="tel:+15556788888">
                <i className="icon-PhoneCall" /> 1-555-678-8888
              </a>
            </div>
            <div className="content-contact-moblile">
              <ul className="tf-social style-border radius-50 g-8 style-2 color-on-suface-container">
                <li className="item">
                  <a href="https://www.messenger.com" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on Messenger">
                    <span className="visually-hidden">Al Bahar & Partners on Messenger</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-messenger" />
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on X">
                    <span className="visually-hidden">Al Bahar & Partners on X</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-x" />
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on Instagram">
                    <span className="visually-hidden">Al Bahar & Partners on Instagram</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-ig1" />
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a href="https://www.skype.com" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on Skype">
                    <span className="visually-hidden">Al Bahar & Partners on Skype</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-skype" />
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on Telegram">
                    <span className="visually-hidden">Al Bahar & Partners on Telegram</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-telegram" />
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
