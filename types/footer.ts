// Footer Content Types

export interface SocialLink {
  _id?: string;
  name: string;
  url: string;
  icon: string; // icon class name or SVG identifier
  order: number;
  isActive: boolean;
}

export interface FooterLink {
  _id?: string;
  title: string;
  href: string;
  order: number;
  isActive: boolean;
}

export interface FooterLinkColumn {
  _id?: string;
  title: string;
  links: FooterLink[];
  order: number;
  isActive: boolean;
}

export interface FooterContactInfo {
  _id?: string;
  label: string;
  value: string;
  order: number;
  isActive: boolean;
}

export interface FooterContactSection {
  _id?: string;
  title: string;
  items: FooterContactInfo[];
  order: number;
  isActive: boolean;
}

export interface FooterBottomLink {
  _id?: string;
  title: string;
  href: string;
  order: number;
  isActive: boolean;
}

export interface FooterContent {
  _id?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Logo & Description
  logo: {
    imagePath: string;
    alt: string;
    width: number;
    height: number;
    link: string;
  };
  description: string;
  
  // Social Media
  socialLinks: SocialLink[];
  
  // Newsletter
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    isActive: boolean;
  };
  
  // Quick Links
  quickLinks: FooterLinkColumn[];
  
  // Service & Assistance
  serviceAssistance: {
    title: string;
    items: FooterContactInfo[];
    isActive: boolean;
  };
  
  // Contact Section
  contactSection: FooterContactSection;
  
  // Footer Bottom
  footerBottom: {
    copyright: string;
    links: FooterBottomLink[];
  };
  
  // Background Image
  backgroundImage: string;
}

export interface FooterResponse {
  success: boolean;
  message?: string;
  data?: FooterContent;
}
