// Header Content Types

export interface MenuItem {
  _id?: string;
  title: string;
  href: string;
  order: number;
  isActive: boolean;
  hasDropdown?: boolean;
  dropdownItems?: MenuItem[];
}

export interface HeaderContent {
  _id?: string;
  logo: {
    imagePath: string;
    alt: string;
    width: number;
    height: number;
    link: string;
  };
  menuItems: MenuItem[];
  buttonText: string;
  buttonLink: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HeaderResponse {
  success: boolean;
  message?: string;
  data?: HeaderContent;
}
