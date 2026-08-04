import FooterCMS from "@/components/footers/FooterCMS";
import HeaderCMS from "@/components/headers/HeaderCMS";
import Header7 from "@/components/headers/Header7";
import React from "react";
import { Metadata } from "next";
import HeroSlider from "@/components/homes/cms/HeroSlider";
import AboutSection from "@/components/homes/cms/AboutSection";
import ProcessSection from "@/components/homes/cms/ProcessSection";
import DeferredHomepageSections from "@/components/homes/cms/DeferredHomepageSections";
import {
  ServicesSection as ServicesSectionType,
} from "@/types/homepage";
import {
  getHomepageContent,
  getHeaderContent,
  getFooterContent,
  getSolutionsContent,
  getBrandsContent,
} from "@/lib/data-fetch";
import Topbar1 from "@/components/headers/Topbar1";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent("rtl");
  const title =
    content?.seo?.title?.trim() || "البحار وشركاه - حلول تقنية المعلومات";
  const description =
    content?.seo?.description?.trim() ||
    "البحار وشركاه تقدم حلول تقنية المعلومات للمؤسسات والاستشارات والخدمات المُدارة في الكويت ومنطقة الخليج العربي.";
  const keywords = content?.seo?.keywords || [];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: "/ar",
      languages: { en: "/", ar: "/ar" },
    },
    openGraph: {
      title,
      description,
      url: "/ar",
      type: "website",
      locale: "ar_KW",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Arabic / RTL homepage — section order matches English homepage
export default async function Page() {
  const language: "ltr" | "rtl" = "rtl";

  const [content, headerContent, footerContent, solutionsContent, brandsContent] =
    await Promise.all([
      getHomepageContent(language),
      getHeaderContent(language),
      getFooterContent(language),
      getSolutionsContent(language),
      getBrandsContent(language),
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
        {content?.aboutSection && (
          <AboutSection content={content.aboutSection} language={language} />
        )}

        {content?.processSection && (
          <ProcessSection content={content.processSection} language={language} />
        )}

        {(() => {
          const baseSection = content?.servicesSection;
          if (!baseSection) {
            return (
              <DeferredHomepageSections
                language={language}
                testimonialSection={content?.testimonialSection ?? null}
                featuresSection={content?.featuresSection ?? null}
                brandsSection={null}
                ctaSection={content?.ctaSection ?? null}
              />
            );
          }

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

          const baseBrands = content?.brandsSection;
          const mappedBrands =
            brandsContent?.brands
              ?.filter((b) => b.isActive)
              .map((b) => ({
                _id: b._id,
                name: b.name,
                imagePath: b.imagePath,
                link: b.link,
                isActive: b.isActive,
              })) || [];

          const brandsSectionForHome = baseBrands
            ? { ...baseBrands, brands: mappedBrands }
            : null;

          return (
            <DeferredHomepageSections
              language={language}
              servicesSection={
                servicesSectionForHome.services.length > 0
                  ? servicesSectionForHome
                  : null
              }
              testimonialSection={content?.testimonialSection ?? null}
              featuresSection={content?.featuresSection ?? null}
              brandsSection={
                brandsSectionForHome && brandsSectionForHome.brands.length > 0
                  ? brandsSectionForHome
                  : null
              }
              ctaSection={content?.ctaSection ?? null}
            />
          );
        })()}
      </div>

      {footerContent && <FooterCMS data={footerContent} />}
    </>
  );
}
