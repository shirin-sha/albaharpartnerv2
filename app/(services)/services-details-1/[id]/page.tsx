import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSolutionsContent } from "@/lib/data-fetch";
import Contact from "@/components/services/Contact";
import CmsRichText from "@/components/common/CmsRichText";
import { getPageTitleBg } from "@/components/common/PageTitleBanner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const content = await getSolutionsContent();
  const service = content?.solutions?.find((s) => s.id === id);

  return {
    title: service
      ? `${service.title} || Al Bahar & Partners`
      : "Service Details || Al Bahar & Partners",
    description: "Detailed view of our solutions and services.",
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const content = await getSolutionsContent();
  const solutions = content?.solutions || [];
  const service = solutions.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  return (
    <>
      <div {...getPageTitleBg(content?.header?.imagePath)}>
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
                    <CmsRichText html={service.detailDescription} className="body-2" />
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
                            href={`/services-details-1/${item.id}`}
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
