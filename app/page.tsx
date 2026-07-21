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
import CaseStudiesSection from "@/components/homes/cms/CaseStudiesSection";
import FeaturesSection from "@/components/homes/cms/FeaturesSection";
import BlogsSection from "@/components/homes/cms/BlogsSection";
import CtaSection from "@/components/homes/cms/CtaSection";
import { HomepageContent, BlogsSection as BlogsSectionType, CaseStudiesSection as CaseStudiesSectionType, ServicesSection as ServicesSectionType } from "@/types/homepage";
import { HeaderContent } from "@/types/header";
import { NewsUpdatesContent } from "@/types/news-updates";
import { CustomerStoriesContent } from "@/types/customer-stories";
import { SolutionsContent } from "@/types/solutions";
import { BrandsContent } from "@/types/brands";
import {
  getHomepageContent,
  getHeaderContent,
  getFooterContent,
  getNewsUpdatesContent,
  getCustomerStoriesContent,
  getSolutionsContent,
  getBrandsContent,
} from "@/lib/data-fetch";
import { newsMainImageSrc } from "@/lib/news-post-images";
import Topbar1 from "@/components/headers/Topbar1";

export async function generateMetadata(): Promise<Metadata> {
  const language: 'ltr' | 'rtl' = 'ltr';
  const content = await getHomepageContent(language);
  const title = content?.seo?.title || "Al bahar partners";
  const description =
    content?.seo?.description ||
    "Al Bahar & Partners delivers enterprise technology solutions, consulting, and managed services across Kuwait and the GCC.";
  const keywords = content?.seo?.keywords || [];

  return {
    title,
    description,
    keywords,
    openGraph: {
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
    newsUpdatesContent,
    customerStoriesContent,
    solutionsContent,
    brandsContent,
  ] = await Promise.all([
    getHomepageContent(language),
    getHeaderContent(language),
    getFooterContent(language),
    getNewsUpdatesContent(language),
    getCustomerStoriesContent(language),
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
        {/* Debug: Show if content exists */}
    
        {/* CMS-driven About Section */}
        {content?.aboutSection && (
          <AboutSection content={content.aboutSection} language={language} />
        )}
        
        {/* CMS-driven Process Section */}
        {content?.processSection && (
          <ProcessSection content={content.processSection} language={language} />
        )}
        
        {/* CMS-driven Services Section (Solutions preview from single Solutions CMS) */}
        {content?.servicesSection && (() => {
          const baseSection: ServicesSectionType = content.servicesSection;

          // Build services array from Solutions CMS (single source of truth)
          const mappedServices = solutionsContent?.solutions
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

          return (
            <ServicesSection content={servicesSectionForHome} language={language} />
          );
        })()}
        
        {/* CMS-driven Testimonial Section */}
        {content?.testimonialSection && (
          <TestimonialSection content={content.testimonialSection} language={language} />
        )}
        
        {/* CMS-driven Brands Section (Brands preview from single Brands CMS) */}
        {content?.brandsSection && (() => {
          const baseSection = content.brandsSection;

          // Build brands array from Brands CMS (single source of truth)
          const mappedBrands = brandsContent?.brands
            ?.filter((b) => b.isActive)
            .map((b) => ({
              _id: b._id,
              name: b.name,
              imagePath: b.imagePath,
              link: b.link,
              isActive: b.isActive,
            })) || [];

          const brandsSectionForHome = {
            ...baseSection,
            brands: mappedBrands,
          };

          if (brandsSectionForHome.brands.length === 0) {
            return null;
          }

          return (
            <BrandsSection content={brandsSectionForHome} language={language} />
          );
        })()}
        
        {/* CMS-driven Case Studies Section (Customer Stories preview from single Customer Stories CMS) */}
        {content?.caseStudiesSection && (() => {
          const baseSection: CaseStudiesSectionType = content.caseStudiesSection;

          // Build case studies array from Customer Stories CMS (single source of truth)
          const mappedCaseStudies = customerStoriesContent?.stories
            ?.filter((s) => s.isActive)
            .map((s) => ({
              _id: s._id,
              title: s.title,
              description: s.description,
              imagePath: s.imagePath,
              link: s.link,
              language: baseSection.language,
              isActive: s.isActive,
            })) || [];

          const caseStudiesSectionForHome: CaseStudiesSectionType = {
            ...baseSection,
            caseStudies: mappedCaseStudies,
          };

          if (caseStudiesSectionForHome.caseStudies.length === 0) {
            return null;
          }

          return (
            <CaseStudiesSection content={caseStudiesSectionForHome} language={language} />
          );
        })()}
        
        {/* CMS-driven Features Section */}
        {content?.featuresSection && (
          <FeaturesSection content={content.featuresSection} language={language} />
        )}
        
        {/* CMS-driven Blogs Section (News preview from single News & Updates CMS) */}
        {content?.blogsSection && (() => {
          const baseSection: BlogsSectionType = content.blogsSection;

          // Build posts array from News & Updates CMS (single source of truth)
          const nonFeaturedPosts = newsUpdatesContent?.posts
            ?.filter((p) => p.isActive && p.isFeatured !== true);
          const sourcePosts =
            nonFeaturedPosts && nonFeaturedPosts.length > 0
              ? nonFeaturedPosts
              : newsUpdatesContent?.posts?.filter((p) => p.isActive) || [];

          const mappedPosts = sourcePosts
            .slice(0, 3)
            .map((p, index) => ({
              _id: p._id,
              title: p.title,
              category: p.category,
              imagePath: newsMainImageSrc(p),
              date: p.date,
              link:
                p.link && p.link.trim() !== "#"
                  ? p.link
                  : `/news-updates/${p._id || String(index + 1)}`,
              order: 0,
              language: baseSection.language,
              isActive: p.isActive,
            })) || [];

          const blogsSectionForHome: BlogsSectionType = {
            ...baseSection,
            posts: mappedPosts,
          };

          if (blogsSectionForHome.posts.length === 0) {
            return null;
          }

          return (
            <BlogsSection content={blogsSectionForHome} language={language} />
          );
        })()}
        
        {/* CMS-driven CTA Section */}
        {content?.ctaSection && (
          <CtaSection content={content.ctaSection} language={language} />
        )}
      </div>
      
      {footerContent && <FooterCMS data={footerContent} />}
    </>
  );
}
