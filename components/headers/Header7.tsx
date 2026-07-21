"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import Nav7 from "./Nav7";

export default function Header7() {
  const [isFixed, setIsFixed] = useState(false);
  const pathname = usePathname();
  const isArabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const switchLocalePath = isArabic
    ? pathname.replace(/^\/ar(?=\/|$)/, "") || "/"
    : `/ar${pathname === "/" ? "" : pathname}`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 21) {
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
  return (
    <header
      className={`header style-1 style-absolute no-bg style-border-radius no-header-bg header-fixed  ${
        isFixed ? "is-fixed" : ""
      } `}
      id="header"
    >
      <div className="tf-container w-1870">
        <div className="row">
          <div className="col-12">
            <div className="header-content">
              <div className="header-left gap-66">
                <div className="logo">
                  <Link href={`/`}>
                    <Image
                      alt="Al Bahar & Partners"
                      src="/image/logo/logo-2.png"
                      width={169}
                      height={40}
                    />
                  </Link>
                </div>
                <nav className="main-menu">
                  <ul className="menu-primary-menu">
                    <Nav7 />
                  </ul>
                </nav>
              </div>
              <div className="header-right">
                <div className="header-actions-tight">
                  <div className="nav-btn">
                    <Link
                      href={switchLocalePath}
                      className="tf-btn bg-color-primary style-1"
                    >
                      <span className={!isArabic ? "font-noto-arabic" : ""}>
                        {isArabic ? "English" : "العربية"}
                      </span>
                    </Link>
                  </div>
                  <div className="nav-btn">
                    <Link
                      href={`#`}
                      className="tf-btn bg-color-primary style-1"
                    >
                      <span>Profile</span>
                    </Link>
                  </div>
                </div>
                <div className="nav-icon">
               
                  <div className="canvas-btn">
                    <a href="#canvnasMegamenu" data-bs-toggle="offcanvas" aria-label="Open navigation menu">
                      <span className="visually-hidden">Open navigation menu</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 6H20.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 12H16"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 18L17.9647 18"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
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
