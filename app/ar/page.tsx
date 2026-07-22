import FooterCMS from "@/components/footers/FooterCMS";
import { FooterContent } from "@/types/footer";
import HeaderCMS from "@/components/headers/HeaderCMS";
import Header7 from "@/components/headers/Header7";
import React from "react";
import { Metadata } from "next";
import HeroSlider from "@/components/homes/cms/HeroSlider";
import AboutSection from "@/components/homes/cms/AboutSection";
import ProcessSection from "@/components/homes/cms/ProcessSection";
import ServicesSection from "@/components/homes/cms/ServicesSection";
import TestimonialSection from "@/components/homes/cms/TestimonialSection";
import BrandsSection from "@/components/homes/cms/BrandsSection";
import FeaturesSection from "@/components/homes/cms/FeaturesSection";
import CtaSection from "@/components/homes/cms/CtaSection";
import {
  ServicesSection as ServicesSectionType,
} from "@/types/homepage";
import {
  getHomepageContent,
  getHeaderContent,
  getFooterContent,
  getSolutionsContent,
} from "@/lib/data-fetch";
import Topbar1 from "@/components/headers/Topbar1";

export const metadata: Metadata = {
  title: "البحار وشركاه - حلول تقنية المعلومات",
  description: "البحار وشركاه تقدم حلول تقنية المعلومات للمؤسسات والاستشارات والخدمات المُدارة في الكويت ومنطقة الخليج العربي.",
};

// Arabic / RTL homepage
export default async function Page() {
  const language: "ltr" | "rtl" = "rtl";

  const [content, headerContent, footerContent, solutionsContent] =
    await Promise.all([
      getHomepageContent(language),
      getHeaderContent(language),
      getFooterContent(language),
      getSolutionsContent(language),
    ]);

  return (
    <>
      <Topbar1 />
      {headerContent ? <HeaderCMS data={headerContent} /> : <Header7 />}

      {/* CMS-driven Hero Section */}
      {content?.heroSlides && content.heroSlides.length > 0 ? (
        <HeroSlider slides={content.heroSlides} language={language} />
      ) : (
        <div className="hero-fallback-note">
          <p>No Hero Slides Found - Please add content in admin (RTL)</p>
        </div>
      )}

      <div className="main-content">
        {/* CMS-driven About Section */}
        {content?.aboutSection && <AboutSection content={content.aboutSection} language={language} />}

        {/* CMS-driven Process Section */}
        {content?.processSection && <ProcessSection content={content.processSection} language={language} />}

        {/* CMS-driven Services Section (Solutions preview from single Solutions CMS) */}
        {content?.servicesSection &&
          (() => {
            const baseSection: ServicesSectionType = content.servicesSection;

            const mappedServices =
              solutionsContent?.solutions
                ?.filter((s) => s.isActive)
                .map((s, index) => ({
                  _id: s.id,
                  id: s.id,
                  tabTitle: s.tabTitle,
                  title: s.title,
                  description: s.description,
                  benefits: s.benefits || [],
                  imgSrc: s.imgSrc,
                  order: index,
                  language: baseSection.language,
                  isActive: s.isActive,
                })) || [];

            const servicesSectionForHome: ServicesSectionType = {
              ...baseSection,
              services: mappedServices,
            };

            if (servicesSectionForHome.services.length === 0) {
              return null;
            }

            return <ServicesSection content={servicesSectionForHome} language={language} />;
          })()}

        {/* CMS-driven Testimonial Section */}
        {content?.testimonialSection && (
          <TestimonialSection content={content.testimonialSection} language={language} />
        )}

        {/* CMS-driven Brands Section */}
        {content?.brandsSection && <BrandsSection content={content.brandsSection} language={language} />}

        {/* CMS-driven Features Section */}
        {content?.featuresSection && <FeaturesSection content={content.featuresSection} language={language} />}

        {/* CMS-driven CTA Section */}
        {content?.ctaSection && <CtaSection content={content.ctaSection} language={language} />}
      </div>

      {footerContent && <FooterCMS data={footerContent} />}
    </>
  );
}

