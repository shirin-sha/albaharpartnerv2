import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function SideOffcanvas() {
  return (
    <div
      className="offcanvas offcanvas-end offcanvasMegamenu"
      id="canvnasMegamenu"
    >
      <div className="heading">
        <Link href="/" className="logo">
          <span className="visually-hidden">
            Al Bahar & Partners — home
          </span>
          <Image
            src="/image/logo/logo-2.png"
            alt=""
            width={169}
            height={41}
          />
        </Link>
        <button
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div className="meag-menu-item">
        <h4 className="title-content fw-7">Start Your Consultation</h4>
        <p>
          Partner-led technology solutions in Kuwait—delivered with structured
          implementation, security-first practices, and dependable post-deployment
          support.
        </p>
      </div>
      <div className="menu-separator" />
      <div className="contact-mega-menu meag-menu-item">
        <h4 className="title-content fw-7">Reach Us</h4>
        <ul className="contact-list-mega-menu">
          <li>
            <span className="contact-icon">📧</span>
            <a href="mailto:enquiries@albaharandpartners.com">
              enquiries@albaharandpartners.com
            </a>
          </li>
          <li>
            <span className="contact-icon">📞</span>
            <a href="tel:+965XXXXXXXX">+965 XXXXXXXX</a>
          </li>
          <li>
            <span className="contact-icon">🛠</span>
            <a href="mailto:support@albaharandpartners.com">
              support@albaharandpartners.com
            </a>
          </li>
          <li>
            <span className="contact-icon">📍</span>
            <span>Kuwait</span>
          </li>
        </ul>
      </div>
      <div className="menu-separator" />
      <div className="meag-menu-item">
        <Link href="/contact-us" className="tf-btn style-1 bg-color-primary offcanvas-cta-btn">
          <span>Start Consultation</span>
          <i className="icon-arrowRight" />
        </Link>
      </div>
      {/* <div className="list-img">
        {blogThumbnails.map((item, index) => (
          <Link
            className="me-2"
            href={`/blog-details-1/${item.id}`}
            key={index}
          >
            <Image
              src={item.imgSrc}
              alt=""
              className="lazyload"
              width={80}
              height={80}
            />
          </Link>
        ))}
      </div> */}
    </div>
  );
}
