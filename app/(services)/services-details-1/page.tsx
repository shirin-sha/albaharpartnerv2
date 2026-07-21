import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getSolutionsContent } from "@/lib/data-fetch";
import Contact from "@/components/services/Contact";

export const metadata: Metadata = {
  title: "Service Details || Al Bahar & Partners",
  description: "Detailed view of our solutions and services.",
};

interface PageProps {
  searchParams?: Promise<{ id?: string }>;
}

export default async function ServiceDetailsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id;

  const content = await getSolutionsContent();
  const solutions = content?.solutions || [];

  const service = id
    ? solutions.find((s) => s.id === id)
    : solutions[0];

  if (!service) {
    return (
      <div className="tf-container" style={{ padding: "80px 0" }}>
        <h1 className="mb-16">Solution not found</h1>
        <p className="body-2 mb-24">
          The requested solution could not be found. Please check the link or return to the solutions page.
        </p>
        <Link href="/solutions" className="tf-btn style-1 bg-color-primary">
          <span>Back to Solutions</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-title style-1 bg-img-8">
        <div className="tf-container">
          <div className="page-title-content">
            <div className="breadkcum">
              <Link href={`/`} className="caption-1 home">
                Homepage
              </Link>{" "}
              <span className="arrow-svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_9360_28061)">
                    <path
                      d="M3.125 10H16.875"
                      stroke="#A2A3AB"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.25 4.375L16.875 10L11.25 15.625"
                      stroke="#A2A3AB"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath>
                      <rect width={20} height={20} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>{" "}
              <Link href="/solutions" className="caption-1 home">
                Solutions
              </Link>{" "}
              <span className="arrow-svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_9360_28061)">
                    <path
                      d="M3.125 10H16.875"
                      stroke="#A2A3AB"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.25 4.375L16.875 10L11.25 15.625"
                      stroke="#A2A3AB"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath>
                      <rect width={20} height={20} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>{" "}
              <span className="caption-1 page-breadkcum">
                {service.title}
              </span>
            </div>
            <h2 className="title-page-title">{service.title}</h2>
            <div
              className="sub-title body-2"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="tf-container tf-spacing-2">
          <div className="row rg-60">
            <div className="col-lg-8">
              <div className="service-details-content">
                {(service.detailImgSrc || service.imgSrc) && (
                  <div className="image-details image mb-60">
                    <Image
                      src={service.detailImgSrc || service.imgSrc}
                      alt={service.title}
                      className="lazyload"
                      width={service.detailImgWidth || service.imgWidth || 850}
                      height={service.detailImgHeight || service.imgHeight || 512}
                    />
                  </div>
                )}
                {service.detailDescription && (
                  <div className="detalis-content mb-40">
                    <div
                      className="body-2"
                      dangerouslySetInnerHTML={{ __html: service.detailDescription }}
                    />
                  </div>
                )}
                {service.benefits && service.benefits.length > 0 && (
                  <div className="detalis-content mb-60" id="menu-sidebar-1">
                    <ul className="benefit-lists">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="benefit-items">
                          <div className="icon">
                            <i className="icon-checkbox" />
                          </div>
                          <div className="title">{benefit}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="tf-sidebar ml-50">
                <div className="sidebar-details mb-40">
                  <ul className="menu-sidebar-tab" role="tablist">
                    {solutions.map((item) => {
                      if (!item.isActive) return null;
                      const isActive = item.id === service.id;

                      return (
                        <li
                          key={item.id}
                          className="nav-tab-item"
                          role="presentation"
                        >
                          <Link
                            href={`/services-details-1?id=${item.id}`}
                            className={`list-menu-item title${
                              isActive ? " active" : ""
                            }`}
                          >
                            {item.title} <i className="icon-arrowRight" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Contact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
