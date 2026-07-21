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
import {
  HomepageContent,
  BlogsSection as BlogsSectionType,
  CaseStudiesSection as CaseStudiesSectionType,
  ServicesSection as ServicesSectionType,
} from "@/types/homepage";
import { HeaderContent } from "@/types/header";
import { NewsUpdatesContent } from "@/types/news-updates";
import { CustomerStoriesContent } from "@/types/customer-stories";
import { SolutionsContent } from "@/types/solutions";
import {
  getHomepageContent,
  getHeaderContent,
  getFooterContent,
  getNewsUpdatesContent,
  getCustomerStoriesContent,
  getSolutionsContent,
} from "@/lib/data-fetch";
import { newsMainImageSrc } from "@/lib/news-post-images";
import Topbar1 from "@/components/headers/Topbar1";

export const metadata: Metadata = {
  title: "البحار وشركاه - حلول تقنية المعلومات",
  description: "البحار وشركاه تقدم حلول تقنية المعلومات للمؤسسات والاستشارات والخدمات المُدارة في الكويت ومنطقة الخليج العربي.",
};

// Arabic / RTL homepage
export default async function Page() {
  const language: "ltr" | "rtl" = "rtl";

  const [content, headerContent, footerContent, newsUpdatesContent, customerStoriesContent, customerStoriesContentLtr, solutionsContent] =
    await Promise.all([
      getHomepageContent(language),
      getHeaderContent(language),
      getFooterContent(language),
      getNewsUpdatesContent(language),
      getCustomerStoriesContent(language),
      getCustomerStoriesContent('ltr'),
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

        {/* CMS-driven Case Studies Section */}
        {content?.caseStudiesSection &&
          (() => {
            const baseSection: CaseStudiesSectionType = content.caseStudiesSection;
            const rtlStories = customerStoriesContent?.stories || [];
            const ltrStories = customerStoriesContentLtr?.stories || [];
            const maxStories = Math.max(rtlStories.length, ltrStories.length);

            const mergedStories = Array.from({ length: maxStories })
              .map((_, index) => {
                const rtlStory = rtlStories[index];
                const ltrStory = ltrStories[index];
                const sourceStory = rtlStory || ltrStory;

                if (!sourceStory) {
                  return null;
                }

                return {
                  _id: sourceStory._id,
                  title: rtlStory?.title || ltrStory?.title || '',
                  description: rtlStory?.description || ltrStory?.description || '',
                  imagePath: rtlStory?.imagePath || ltrStory?.imagePath || '',
                  link: rtlStory?.link || ltrStory?.link || '#',
                  language: baseSection.language,
                  isActive: rtlStory?.isActive ?? ltrStory?.isActive ?? true,
                };
              })
              .filter((story): story is NonNullable<typeof story> => Boolean(story));

            const mappedCaseStudies =
              mergedStories
                .filter((s) => s.isActive);

            const caseStudiesSectionForHome: CaseStudiesSectionType = {
              ...baseSection,
              caseStudies: mappedCaseStudies,
            };

            if (caseStudiesSectionForHome.caseStudies.length === 0) {
              return null;
            }

            return <CaseStudiesSection content={caseStudiesSectionForHome} language={language} />;
          })()}

        {/* CMS-driven Features Section */}
        {content?.featuresSection && <FeaturesSection content={content.featuresSection} language={language} />}

        {/* CMS-driven Blogs Section */}
        {content?.blogsSection &&
          (() => {
            const baseSection: BlogsSectionType = content.blogsSection;

            const nonFeaturedPosts =
              newsUpdatesContent?.posts
                ?.filter((p) => p.isActive && p.isFeatured !== true);
            const sourcePosts =
              nonFeaturedPosts && nonFeaturedPosts.length > 0
                ? nonFeaturedPosts
                : newsUpdatesContent?.posts?.filter((p) => p.isActive) || [];

            const mappedPosts =
              sourcePosts
                .sort((a, b) => {
                  // Sort by date if available (latest first)
                  if (a.date && b.date) {
                    const dateA = typeof a.date === 'string' ? new Date(a.date).getTime() : 
                                 (a.date.day && a.date.month ? new Date(`${a.date.month} ${a.date.day}`).getTime() : 0);
                    const dateB = typeof b.date === 'string' ? new Date(b.date).getTime() : 
                                 (b.date.day && b.date.month ? new Date(`${b.date.month} ${b.date.day}`).getTime() : 0);
                    return dateB - dateA;
                  }
                  return 0;
                })
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
                      : `/ar/news-updates/${p._id || String(index + 1)}`,
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

            return <BlogsSection content={blogsSectionForHome} language={language} />;
          })()}

        {/* CMS-driven CTA Section */}
        {content?.ctaSection && <CtaSection content={content.ctaSection} language={language} />}
      </div>

      {footerContent && <FooterCMS data={footerContent} />}
    </>
  );
}

