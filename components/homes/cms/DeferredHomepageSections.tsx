import dynamic from "next/dynamic";
import type {
  BrandsSection as BrandsSectionType,
  FeaturesSection as FeaturesSectionType,
  ServicesSection as ServicesSectionType,
  TestimonialSection as TestimonialSectionType,
  CtaSection as CtaSectionType,
} from "@/types/homepage";

const ServicesSection = dynamic(() => import("@/components/homes/cms/ServicesSection"), {
  loading: () => <div className="section-services h-7" aria-hidden style={{ minHeight: 420 }} />,
});

const TestimonialSection = dynamic(() => import("@/components/homes/cms/TestimonialSection"), {
  loading: () => <div className="section-testimonials" aria-hidden style={{ minHeight: 360 }} />,
});

const FeaturesSection = dynamic(() => import("@/components/homes/cms/FeaturesSection"), {
  loading: () => <div className="section-benefits h-7" aria-hidden style={{ minHeight: 420 }} />,
});

const BrandsSection = dynamic(() => import("@/components/homes/cms/BrandsSection"), {
  loading: () => <div className="section-brands" aria-hidden style={{ minHeight: 200 }} />,
});

const CtaSection = dynamic(() => import("@/components/homes/cms/CtaSection"), {
  loading: () => <div className="section-banner h-8" aria-hidden style={{ minHeight: 280 }} />,
});

type Props = {
  language: "ltr" | "rtl";
  servicesSection?: ServicesSectionType | null;
  testimonialSection?: TestimonialSectionType | null;
  featuresSection?: FeaturesSectionType | null;
  brandsSection?: BrandsSectionType | null;
  ctaSection?: CtaSectionType | null;
};

export default function DeferredHomepageSections({
  language,
  servicesSection,
  testimonialSection,
  featuresSection,
  brandsSection,
  ctaSection,
}: Props) {
  return (
    <>
      {servicesSection && servicesSection.services.length > 0 && (
        <ServicesSection content={servicesSection} language={language} />
      )}
      {testimonialSection && (
        <TestimonialSection content={testimonialSection} language={language} />
      )}
      {featuresSection && (
        <FeaturesSection content={featuresSection} language={language} />
      )}
      {brandsSection && brandsSection.brands.length > 0 && (
        <BrandsSection content={brandsSection} language={language} />
      )}
      {ctaSection && <CtaSection content={ctaSection} language={language} />}
    </>
  );
}
