import { notFound, redirect } from 'next/navigation';
import FooterCMS from "@/components/footers/FooterCMS";
import HeaderCMS from "@/components/headers/HeaderCMS";
import Header7 from "@/components/headers/Header7";
import Topbar1 from "@/components/headers/Topbar1";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getHeaderContent, getFooterContent, getAboutUsContent, getSolutionsContent, getContactUsContent, getSupportContent, getCareersContent, getCustomerStoriesContent, getNewsUpdatesContent, getBrandsContent, getCustomerCareContent } from "@/lib/data-fetch";
import Breadcumb from "@/components/common/Breadcumb";
import PageTitleBanner, { getPageTitleBg } from "@/components/common/PageTitleBanner";
import AboutAlBaharCMS from "@/components/otherPages/AboutAlBaharCMS";
import VisionMissionValuesCMS from "@/components/otherPages/VisionMissionValuesCMS";
import HeritageCMS from "@/components/otherPages/HeritageCMS";
import AboutBPCCMS from "@/components/otherPages/AboutBPCCMS";
import HistoryCMS from "@/components/otherPages/HistoryCMS";
import FaqsCMS from "@/components/otherPages/FaqsCMS";
import ServicesCMS from "@/components/services/ServicesCMS";
import ContactCMS from "@/components/otherPages/ContactCMS";
import MapCMS from "@/components/otherPages/MapCMS";
import SupportServicesCMS from "@/components/otherPages/SupportServicesCMS";
import SupportContactCMS from "@/components/otherPages/SupportContactCMS";
import CustomerCareCMS from "@/components/otherPages/CustomerCareCMS";
import CareerCMS from "@/components/otherPages/CareerCMS";
import CustomerStoriesCMS from "@/components/case-studies/CustomerStoriesCMS";
import NewsUpdatesCMS from "@/components/blogs/NewsUpdatesCMS";
import BrandsCMS from "@/components/case-studies/BrandsCMS";
import Contact from "@/components/services/Contact";
import CmsRichText from "@/components/common/CmsRichText";
import { defaultSolutionsDetailPage } from "@/types/solutions";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams?: Promise<{
    id?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray?.[0] || '';
  const pageName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  
  return {
    title: `Al bahar partners - ${pageName} (Arabic)`,
    description: "",
  };
}

export default async function ArabicPage({ params, searchParams }: PageProps) {
  const { slug: slugArray } = await params;
  const slug = slugArray?.[0] || '';
  const resolvedSearchParams = await searchParams;
  const language: 'ltr' | 'rtl' = 'rtl';

  // If no slug, redirect to home (handled by /ar/page.tsx)
  if (!slug || slug === '') {
    notFound();
  }

  // Get header and footer for RTL
  const [headerContent, footerContent] = await Promise.all([
    getHeaderContent(language),
    getFooterContent(language),
  ]);

  // Render page content based on slug
  let pageContent: React.ReactNode = null;

  switch (slug) {
    case 'about-us': {
      const content = await getAboutUsContent(language);
      const headerData = content?.header || {
        breadcrumb: "About Us",
        title: "About Us",
        subtitle: "Discover our mission to empower clients with expert solutions for confident, sustainable growth and success.",
        language: "rtl" as const,
        isActive: true,
      };
      pageContent = (
        <>
          {headerData.isActive && (
            <div className="page-title style-1 bg-img-8">
              <div className="tf-container">
                <div className="page-title-content">
                  <Breadcumb pageName={headerData.breadcrumb} />
                  <h2 className="title-page-title">{headerData.title}</h2>
                  <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle }} />
                </div>
              </div>
            </div>
          )}
          <div className="main-content">
            {content?.heritage && <HeritageCMS data={content.heritage} />}
            {content?.aboutAlBahar && <AboutAlBaharCMS data={content.aboutAlBahar} />}
            {content?.history && <HistoryCMS data={content.history} />}
            {content?.aboutBPC && <AboutBPCCMS data={content.aboutBPC} />}
            {content?.visionMissionValues && <VisionMissionValuesCMS data={content.visionMissionValues} />}
            {content?.faqs && <FaqsCMS data={content.faqs} />}
          </div>
        </>
      );
      break;
    }

    case 'solutions': {
      const content = await getSolutionsContent(language);
      const headerData = content?.header || {
        breadcrumb: "Solutions",
        title: "Solutions",
        subtitle: "",
        language: "rtl" as const,
        isActive: true,
      };
      pageContent = (
        <>
          <PageTitleBanner
            breadcrumb={headerData.breadcrumb}
            title={headerData.title}
            subtitle={headerData.subtitle}
            imagePath={headerData.imagePath}
            isActive={headerData.isActive}
          />
          <div className="main-content">
            {content && <ServicesCMS data={content} language={language} />}
          </div>
        </>
      );
      break;
    }

    case 'services-details-1': {
      const pathId = slugArray?.[1];
      const queryId = resolvedSearchParams?.id;

      // Legacy: /ar/services-details-1?id=... → /ar/services-details-1/[id]
      if (!pathId && queryId) {
        redirect(`/ar/services-details-1/${queryId}`);
      }

      const content = await getSolutionsContent(language);
      const solutions = content?.solutions || [];

      if (!pathId) {
        const firstActive = solutions.find((s) => s.isActive) || solutions[0];
        if (firstActive?.id) {
          redirect(`/ar/services-details-1/${firstActive.id}`);
        }
        redirect("/ar/solutions");
      }

      const service = solutions.find((s) => s.id === pathId);

      if (!service) {
        pageContent = (
          <div className="tf-container" style={{ padding: "80px 0" }}>
            <h1 className="mb-16">الخدمة غير موجودة</h1>
            <p className="body-2 mb-24">تعذر العثور على الخدمة المطلوبة.</p>
            <Link href="/ar/solutions" className="tf-btn style-1 bg-color-primary">
              <span>العودة إلى الحلول</span>
            </Link>
          </div>
        );
        break;
      }

      const detailPage = content?.detailPage || defaultSolutionsDetailPage("rtl");
      const bannerImage =
        detailPage.imagePath?.trim() || content?.header?.imagePath || "";

      pageContent = (
        <>
          <div {...getPageTitleBg(bannerImage)}>
            <div className="tf-container">
              <div className="page-title-content">
                <div className="breadkcum">
                  <Link href="/ar" className="caption-1 home">
                    {detailPage.homeBreadcrumb}
                  </Link>{" "}
                  <span className="arrow-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                      <g clipPath="url(#clip0_9360_28061)">
                        <path d="M3.125 10H16.875" stroke="#A2A3AB" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.25 4.375L16.875 10L11.25 15.625" stroke="#A2A3AB" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs><clipPath><rect width={20} height={20} fill="white" /></clipPath></defs>
                    </svg>
                  </span>{" "}
                  <Link href="/ar/solutions" className="caption-1 home">
                    {detailPage.solutionsBreadcrumb}
                  </Link>{" "}
                  <span className="arrow-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                      <g clipPath="url(#clip0_9360_28061)">
                        <path d="M3.125 10H16.875" stroke="#A2A3AB" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.25 4.375L16.875 10L11.25 15.625" stroke="#A2A3AB" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs><clipPath><rect width={20} height={20} fill="white" /></clipPath></defs>
                    </svg>
                  </span>{" "}
                  <span className="caption-1 page-breadkcum">{service.title}</span>
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
                              <div className="icon"><i className="icon-checkbox" /></div>
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
                            <li key={item.id} className="nav-tab-item" role="presentation">
                              <Link
                                href={`/ar/services-details-1/${item.id}`}
                                className={`list-menu-item title${isActive ? " active" : ""}`}
                              >
                                {item.title} <i className="icon-arrowRight" />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <Contact data={detailPage.contact} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
      break;
    }

    case 'contact-us': {
      const content = await getContactUsContent(language);
      const headerData = content?.header || {
        breadcrumb: "Contact Us",
        title: "Contact Us",
        subtitle: "Explore success stories from businesses that achieved growth through our tailored strategies and solutions.",
        language: "rtl" as const,
        isActive: true,
      };
      pageContent = (
        <>
          {headerData.isActive && (
            <div className="page-title style-1 bg-img-8">
              <div className="tf-container position-relative">
                <div className="page-title-content">
                  <Breadcumb pageName={headerData.breadcrumb} />
                  <h2 className="title-page-title">{headerData.title}</h2>
                  {headerData.subtitle && (
                    <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle.replace(/\n/g, '<br />') }} />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="main-content">
            {content && (
              <>
                <ContactCMS data={content} />
                <MapCMS data={content} />
              </>
            )}
          </div>
        </>
      );
      break;
    }

    case 'support': {
      const content = await getSupportContent(language);
      const headerData = content?.header || {
        breadcrumb: "Support",
        title: "Support",
        subtitle: "From incident resolution to preventive maintenance, our support teams keep your operations secure, stable, and always available.",
        language: "rtl" as const,
        isActive: true,
      };
      pageContent = (
        <>
          {headerData.isActive && (
            <div className="page-title style-1 bg-img-8">
              <div className="tf-container">
                <div className="page-title-content">
                  <Breadcumb pageName={headerData.breadcrumb} />
                  <h2 className="title-page-title">{headerData.title}</h2>
                  {headerData.subtitle && (
                    <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle.replace(/\n/g, '<br />') }} />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="main-content">
            {content && (
              <>
                <SupportServicesCMS data={content} />
                <SupportContactCMS data={content} />
              </>
            )}
          </div>
        </>
      );
      break;
    }

    case 'customer-care-center': {
      const content = await getCustomerCareContent(language);
      const headerData = content?.header || {
        breadcrumb: "مركز خدمة العملاء",
        title: "مركز خدمة العملاء لدى البحر",
        subtitle: "",
        imagePath: "",
        isActive: true,
      };
      pageContent = (
        <>
          <PageTitleBanner
            breadcrumb={headerData.breadcrumb}
            title={headerData.title}
            subtitle={headerData.subtitle}
            imagePath={headerData.imagePath}
            isActive={headerData.isActive !== false}
          />
          <div className="main-content">
            {content && <CustomerCareCMS data={content} language="rtl" />}
          </div>
        </>
      );
      break;
    }

    case 'career': {
      const content = await getCareersContent(language);
      const headerData = content?.header || {
        breadcrumb: "Careers",
        title: "Careers",
        subtitle: "Join our team of industry experts and make a meaningful impact. Discover opportunities to grow your career with us in a dynamic & rewarding environment.",
        language: "rtl" as const,
        isActive: true,
      };
      pageContent = (
        <>
          <PageTitleBanner
            breadcrumb={headerData.breadcrumb}
            title={headerData.title}
            subtitle={headerData.subtitle}
            imagePath={headerData.imagePath}
            isActive={headerData.isActive}
          />
          <div className="main-content">
            {content && <CareerCMS data={content} />}
          </div>
        </>
      );
      break;
    }

    case 'customer-stories': {
      const content = await getCustomerStoriesContent(language);
      const headerData = content?.header || {
        breadcrumb: "Customer Stories",
        title: "Customer Stories",
        subtitle: "See how Al Bahar & Partners helps organizations strengthen security, improve visibility, and modernize IT through proven technology deployments.",
        language: "rtl" as const,
        isActive: true,
      };
      pageContent = (
        <>
          {headerData.isActive && (
            <div className="page-title style-1 bg-img-8">
              <div className="tf-container">
                <div className="page-title-content">
                  <Breadcumb pageName={headerData.breadcrumb} />
                  <h2 className="title-page-title">{headerData.title}</h2>
                  {headerData.subtitle && (
                    <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle.replace(/\n/g, '<br />') }} />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="main-content">
            {content && <CustomerStoriesCMS data={content} />}
          </div>
        </>
      );
      break;
    }

    case 'news-updates': {
      const content = await getNewsUpdatesContent(language);
      const headerData = content?.header || {
        breadcrumb: "News & Updates",
        title: "News & Updates",
        subtitle: "",
        language: "rtl" as const,
        isActive: true,
      };
      pageContent = (
        <>
          {headerData.isActive && (
            <div className="page-title style-1 bg-img-8">
              <div className="tf-container">
                <div className="page-title-content">
                  <Breadcumb pageName={headerData.breadcrumb} />
                  <h2 className="title-page-title">{headerData.title}</h2>
                  {headerData.subtitle && (
                    <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle.replace(/\n/g, '<br />') }} />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="main-content tf-spacing-2">
            {content && <NewsUpdatesCMS data={content} postsBasePath="/ar/news-updates" />}
          </div>
        </>
      );
      break;
    }

    case 'brands': {
      const content = await getBrandsContent(language);
      const headerData = content?.header || {
        breadcrumb: "Brands",
        title: "Brands",
        subtitle: "",
        language: "rtl" as const,
        isActive: true,
      };
      pageContent = (
        <>
          {headerData.isActive && (
            <div className="page-title style-1 bg-img-8">
              <div className="tf-container">
                <div className="page-title-content">
                  <Breadcumb pageName={headerData.breadcrumb} />
                  <h2 className="title-page-title">{headerData.title}</h2>
                  {headerData.subtitle && (
                    <div className="sub-title body-2" dangerouslySetInnerHTML={{ __html: headerData.subtitle.replace(/\n/g, '<br />') }} />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="main-content">
            {content && <BrandsCMS data={content} />}
          </div>
        </>
      );
      break;
    }

    default:
      notFound();
  }

  return (
    <>
      <Topbar1 />
      {headerContent ? <HeaderCMS data={headerContent} /> : <Header7 />}
      {pageContent}
      {footerContent && <FooterCMS data={footerContent} />}
    </>
  );
}
