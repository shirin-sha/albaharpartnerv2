import FooterCMS from "@/components/footers/FooterCMS";
import { FooterContent } from "@/types/footer";
import HeaderCMS from "@/components/headers/HeaderCMS";
import React from "react";
import { Metadata } from "next";
import HeroSlider from "@/components/homes/cms/HeroSlider";
import AboutSection from "@/components/homes/cms/AboutSection";
import ProcessSection from "@/components/homes/cms/ProcessSection";
import DeferredHomepageSections from "@/components/homes/cms/DeferredHomepageSections";
import { ServicesSection as ServicesSectionType } from "@/types/homepage";
import {
  getHomepageContent,
  getHeaderContent,
  getFooterContent,
  getSolutionsContent,
  getBrandsContent,
} from "@/lib/data-fetch";
import Topbar1 from "@/components/headers/Topbar1";

export async function generateMetadata(): Promise<Metadata> {
  const language: 'ltr' | 'rtl' = 'ltr';
  const content = await getHomepageContent(language);
  const title = content?.seo?.title?.trim() || "Al Bahar & Partners - Technology Solutions";
  const description =
    content?.seo?.description?.trim() ||
    "Al Bahar & Partners delivers enterprise technology solutions, consulting, and managed services across Kuwait and the GCC.";
  const keywords = content?.seo?.keywords || [];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: "/",
      languages: { en: "/", ar: "/ar" },
    },
    openGraph: {
      title,
      description,
      url: "/",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Static generation with on-demand revalidation (triggered from admin panel)
// Pages are pre-generated at build time and regenerate when admin updates content via revalidatePath
// Using ISR with long revalidate time - pages stay static until admin triggers regeneration
export const revalidate = 3600; // ISR: Regenerates after 1 hour OR immediately when admin calls revalidatePath

export default async function Page() {
  // Language is always 'ltr' for the root page
  const language: 'ltr' | 'rtl' = 'ltr';
  
  // Fetch all data in parallel for better performance
  const [
    content,
    headerContent,
    footerContent,
    solutionsContent,
    brandsContent,
  ] = await Promise.all([
    getHomepageContent(language),
    getHeaderContent(language),
    getFooterContent(language),
    getSolutionsContent(language),
    getBrandsContent(language),
  ]);

  return (
    <>
      <Topbar1 />
      {headerContent && <HeaderCMS data={headerContent} /> }
      {/* CMS-driven Hero Section */}
      {content?.heroSlides && content.heroSlides.length > 0 ? (
        <HeroSlider slides={content.heroSlides} language={language} />
      ) : (
        <div className="hero-fallback-placeholder">
          {/* <p>No Hero Slides Found - Please add content in admin</p> */}
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
          if (!baseSection) return null;

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
