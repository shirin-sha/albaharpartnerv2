import type { SectionFieldComponent } from '@/app/admin/homepage/types';
import { HeroFields } from './HeroFields';
import { AboutFields } from './AboutFields';
import { ProcessFields } from './ProcessFields';
import { ServicesFields } from './ServicesFields';
import { TestimonialFields } from './TestimonialFields';
import { BrandsFields } from './BrandsFields';
import { CaseStudiesFields } from './CaseStudiesFields';
import { FeaturesFields } from './FeaturesFields';
import { BlogsFields } from './BlogsFields';
import { CtaFields } from './CtaFields';
import { MetaFields } from './MetaFields';

export const SECTION_FIELD_RENDERERS: Record<string, SectionFieldComponent> = {
  meta: MetaFields,
  hero: HeroFields,
  about: AboutFields,
  process: ProcessFields,
  services: ServicesFields,
  testimonial: TestimonialFields,
  brands: BrandsFields,
  caseStudies: CaseStudiesFields,
  features: FeaturesFields,
  blogs: BlogsFields,
  cta: CtaFields,
};

export { MetaFields, HeroFields, AboutFields, ProcessFields, ServicesFields, TestimonialFields, BrandsFields, CaseStudiesFields, FeaturesFields, BlogsFields, CtaFields };
