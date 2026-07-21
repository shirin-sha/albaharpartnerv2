/**
 * Direct database access functions for server components
 * These replace HTTP API calls for better performance
 * Uses Next.js caching for faster navigation
 */

import { getDatabase } from './mongodb';
import { HomepageContent } from '@/types/homepage';
import { HeaderContent } from '@/types/header';
import { FooterContent } from '@/types/footer';
import { NewsUpdatesContent } from '@/types/news-updates';
import { CustomerStoriesContent } from '@/types/customer-stories';
import { SolutionsContent } from '@/types/solutions';
import { AboutUsContent } from '@/types/aboutus';
import { ContactUsContent } from '@/types/contact-us';
import { SupportContent } from '@/types/support';
import { CareersContent } from '@/types/careers';
import { BrandsContent } from '@/types/brands';
import { unstable_cache } from 'next/cache';

const DB_NAME = 'albaharpartners1';

// Cache duration: 60 seconds (revalidated on-demand from admin)
const CACHE_TAG_PREFIX = 'cms-content';
const CACHE_REVALIDATE = 60;

/**
 * Fetch homepage content directly from database (cached)
 */
export async function getHomepageContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<HomepageContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<HomepageContent>('homepage');
        
        const content = await collection.findOne({
          language,
          isActive: true,
        });
        
        if (!content) {
          return null;
        }
        
        return {
          ...content,
          _id: content._id?.toString(),
        } as HomepageContent;
      } catch (error) {
        console.error('Error fetching homepage content:', error);
        return null;
      }
    },
    [`homepage-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-homepage-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch header content directly from database (cached)
 * Logo is always taken from LTR content to ensure consistency
 */
export async function getHeaderContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<HeaderContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<HeaderContent>('header');
        
        // Always get LTR content for logo (logo is language-agnostic)
        const ltrContent = await collection.findOne({ language: 'ltr' });
        const content = await collection.findOne({ language });
        
        if (!content) {
          return null;
        }
        
        // Use LTR logo for both languages to ensure consistency
        const headerContent: HeaderContent = {
          ...content,
          _id: content._id?.toString(),
          logo: ltrContent?.logo || content.logo, // Always use LTR logo
        };
        
        return headerContent;
      } catch (error) {
        console.error('Error fetching header content:', error);
        return null;
      }
    },
    [`header-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-header-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch footer content directly from database (cached)
 */
export async function getFooterContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<FooterContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<FooterContent>('footer');
        
        const content = await collection.findOne({ language });
        
        if (!content) {
          return null;
        }
        
        return {
          ...content,
          _id: content._id?.toString(),
        } as FooterContent;
      } catch (error) {
        console.error('Error fetching footer content:', error);
        return null;
      }
    },
    [`footer-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-footer-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch News & Updates content directly from database (cached)
 */
export async function getNewsUpdatesContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<NewsUpdatesContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<NewsUpdatesContent>('newsupdates');
        
        const content = await collection.findOne({ language });
        const sharedPostsSource = await collection.findOne({ language: 'ltr' });
        
        if (!content) {
          return null;
        }
        
        const sourcePosts = sharedPostsSource?.posts || content.posts || [];
        const localizedPosts = sourcePosts.map((post) => ({
          ...post,
          title: language === 'rtl' ? (post.titleAr || post.title) : post.title,
          category: language === 'rtl' ? (post.categoryAr || post.category) : post.category,
          shortDescription:
            language === 'rtl'
              ? (post.shortDescriptionAr || post.shortDescription || '')
              : (post.shortDescription || ''),
          longDescription:
            language === 'rtl'
              ? (post.longDescriptionAr || post.longDescription || '')
              : (post.longDescription || ''),
        }));
        
        return {
          ...content,
          posts: localizedPosts,
          _id: content._id?.toString(),
        } as NewsUpdatesContent;
      } catch (error) {
        console.error('Error fetching news updates content:', error);
        return null;
      }
    },
    [`newsupdates-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-newsupdates-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch Customer Stories content directly from database (cached)
 */
export async function getCustomerStoriesContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<CustomerStoriesContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<CustomerStoriesContent>('customerstories');
        
        const content = await collection.findOne({ language });
        const sharedStoriesSource = await collection.findOne({ language: 'ltr' });
        
        if (!content) {
          return null;
        }

        const sourceStories = sharedStoriesSource?.stories || content.stories || [];
        const localizedStories = sourceStories.map((story) => ({
          ...story,
          title: language === 'rtl' ? (story.titleAr || story.title) : story.title,
          description: language === 'rtl' ? (story.descriptionAr || story.description) : story.description,
        }));
        
        return {
          ...content,
          stories: localizedStories,
          _id: content._id?.toString(),
        } as CustomerStoriesContent;
      } catch (error) {
        console.error('Error fetching customer stories content:', error);
        return null;
      }
    },
    [`customerstories-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-customerstories-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch Solutions content directly from database (cached)
 */
export async function getSolutionsContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<SolutionsContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<SolutionsContent>('solutions');
        
        const content = await collection.findOne({ language });
        const sharedSolutionsSource = await collection.findOne({ language: 'ltr' });
        
        if (!content) {
          return null;
        }
        
        const sourceSolutions = sharedSolutionsSource?.solutions || content.solutions || [];
        const localizedSolutions = sourceSolutions.map((solution) => ({
          ...solution,
          tabTitle: language === 'rtl' ? (solution.tabTitleAr || solution.tabTitle) : solution.tabTitle,
          title: language === 'rtl' ? (solution.titleAr || solution.title) : solution.title,
          description: language === 'rtl' ? (solution.descriptionAr || solution.description) : solution.description,
          detailDescription: language === 'rtl' ? (solution.detailDescriptionAr || solution.detailDescription) : solution.detailDescription,
          benefits: language === 'rtl'
            ? ((solution.benefitsAr && solution.benefitsAr.length > 0) ? solution.benefitsAr : solution.benefits)
            : solution.benefits,
        }));
        
        return {
          ...content,
          solutions: localizedSolutions,
          _id: content._id?.toString(),
        } as SolutionsContent;
      } catch (error) {
        console.error('Error fetching solutions content:', error);
        return null;
      }
    },
    [`solutions-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-solutions-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch About Us content directly from database (cached)
 */
export async function getAboutUsContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<AboutUsContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<AboutUsContent>('aboutus');
        
        const content = await collection.findOne({ language });
        
        if (!content) {
          return null;
        }
        
        return {
          ...content,
          _id: content._id?.toString(),
        } as AboutUsContent;
      } catch (error) {
        console.error('Error fetching about us content:', error);
        return null;
      }
    },
    [`aboutus-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-aboutus-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch Contact Us content directly from database (cached)
 */
export async function getContactUsContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<ContactUsContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<ContactUsContent>('contactus');
        
        const content = await collection.findOne({ language });
        
        if (!content) {
          return null;
        }
        
        return {
          ...content,
          _id: content._id?.toString(),
        } as ContactUsContent;
      } catch (error) {
        console.error('Error fetching contact us content:', error);
        return null;
      }
    },
    [`contactus-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-contactus-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch Support content directly from database (cached)
 */
export async function getSupportContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<SupportContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<SupportContent>('support');
        
        const content = await collection.findOne({ language });
        
        if (!content) {
          return null;
        }
        
        return {
          ...content,
          _id: content._id?.toString(),
        } as SupportContent;
      } catch (error) {
        console.error('Error fetching support content:', error);
        return null;
      }
    },
    [`support-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-support-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch Careers content directly from database (cached)
 */
export async function getCareersContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<CareersContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<CareersContent>('careers');
        
        const content = await collection.findOne({ language });
        const sharedJobsSource = await collection.findOne({ language: 'ltr' });
        
        if (!content) {
          return null;
        }
        
        const sourceJobs = sharedJobsSource?.jobs || content.jobs || [];
        const localizedJobs = sourceJobs.map((job) => ({
          ...job,
          title: language === 'rtl' ? (job.titleAr || job.title) : job.title,
          description: language === 'rtl' ? (job.descriptionAr || job.description) : job.description,
          responsibilities: language === 'rtl'
            ? ((job.responsibilitiesAr && job.responsibilitiesAr.length > 0) ? job.responsibilitiesAr : job.responsibilities)
            : job.responsibilities,
        }));
        
        return {
          ...content,
          jobs: localizedJobs,
          _id: content._id?.toString(),
        } as CareersContent;
      } catch (error) {
        console.error('Error fetching careers content:', error);
        return null;
      }
    },
    [`careers-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-careers-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}

/**
 * Fetch Brands content directly from database (cached)
 */
export async function getBrandsContent(language: 'ltr' | 'rtl' = 'ltr'): Promise<BrandsContent | null> {
  return unstable_cache(
    async () => {
      try {
        const db = await getDatabase(DB_NAME);
        const collection = db.collection<BrandsContent>('brands');
        
        const content = await collection.findOne({ language });
        const sharedBrandsSource = await collection.findOne({ language: 'ltr' });
        
        if (!content) {
          return null;
        }
        
        const sourceBrands = sharedBrandsSource?.brands || content.brands || [];
        const localizedBrands = sourceBrands.map((brand) => ({
          ...brand,
          name: language === 'rtl' ? (brand.nameAr || brand.name) : brand.name,
          description: language === 'rtl' ? (brand.descriptionAr || brand.description) : brand.description,
        }));
        
        return {
          ...content,
          _id: content._id?.toString(),
          brands: localizedBrands?.map((brand) => ({
            ...brand,
            _id: brand._id?.toString(),
            products: brand.products?.map((product) => ({
              ...product,
              _id: product._id?.toString(),
            })) || [],
          })) || [],
        } as BrandsContent;
      } catch (error) {
        console.error('Error fetching brands content:', error);
        return null;
      }
    },
    [`brands-${language}`],
    {
      tags: [`${CACHE_TAG_PREFIX}-brands-${language}`],
      revalidate: CACHE_REVALIDATE,
    }
  )();
}
