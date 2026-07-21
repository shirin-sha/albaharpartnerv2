'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type IconName =
  | 'cms'
  | 'home'
  | 'about'
  | 'solutions'
  | 'brands'
  | 'stories'
  | 'news'
  | 'careers'
  | 'support'
  | 'contact'
  | 'header'
  | 'footer'
  | 'enquiries';

function SidebarIcon({ name }: { name: IconName }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'home':
      return <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case 'about':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>;
    case 'solutions':
      return <svg {...common}><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="8" y="13" width="8" height="8" rx="1" /></svg>;
    case 'brands':
      return <svg {...common}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></svg>;
    case 'stories':
      return <svg {...common}><path d="M4 5h16v14H4z" /><path d="M8 9h8" /><path d="M8 13h5" /></svg>;
    case 'news':
      return <svg {...common}><path d="M4 6h14v12H4z" /><path d="M18 8h2v8a2 2 0 0 1-2 2H6" /><path d="M7 10h8M7 13h8" /></svg>;
    case 'careers':
      return <svg {...common}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5h8v2" /></svg>;
    case 'support':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>;
    case 'contact':
      return <svg {...common}><path d="M4 5h16v14H4z" /><path d="m4 7 8 6 8-6" /></svg>;
    case 'header':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></svg>;
    case 'footer':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 15h18" /></svg>;
    case 'enquiries':
      return <svg {...common}><path d="M4 6h16v12H4z" /><path d="m4 8 8 6 8-6" /></svg>;
    case 'cms':
    default:
      return <svg {...common}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>;
  }
}

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [cmsOpen, setCmsOpen] = useState(false);
  const [enquiriesOpen, setEnquiriesOpen] = useState(false);

  useEffect(() => {
    // Auto-expand CMS menu if on CMS pages
    const shouldOpen = pathname?.startsWith('/admin/cms') || pathname?.startsWith('/admin/homepage');
    if (shouldOpen) {
      setCmsOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const shouldOpen = pathname?.startsWith('/admin/enquiries') || pathname?.startsWith('/admin/job-inquiries');
    if (shouldOpen) {
      setEnquiriesOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isCmsActive = () => {
    return pathname?.startsWith('/admin/cms') || pathname?.startsWith('/admin/homepage');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
      <Image
            src="/image/logo/logo-2.png"
            alt="Al Bahar & Partners"
            width={180}
            height={45}
            style={{ margin: "0 auto" }}
          />
      </div>
      <nav className="admin-sidebar-nav">
     
        
        <div className={`admin-sidebar-group ${isCmsActive() ? 'active' : ''}`}>
          <button
            type="button"
            className={`admin-sidebar-group-toggle ${cmsOpen ? 'open' : ''}`}
            onClick={() => setCmsOpen(!cmsOpen)}
          >
            <span className="admin-sidebar-label">
              <span className="admin-sidebar-icon"><SidebarIcon name="cms" /></span>
              <span>CMS</span>
            </span>
            <span className="admin-sidebar-arrow">{cmsOpen ? '▼' : '▶'}</span>
          </button>
          {cmsOpen && (
            <div className="admin-sidebar-submenu">
              <Link
                href="/admin/homepage"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/homepage') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="home" /></span><span>Home</span></span>
              </Link>
              <Link
                href="/admin/cms/about-us"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/about-us') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="about" /></span><span>About</span></span>
              </Link>
              <Link
                href="/admin/cms/solutions"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/solutions') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="solutions" /></span><span>Solutions</span></span>
              </Link>
              <Link
                href="/admin/cms/brands"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/brands') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="brands" /></span><span>Brands</span></span>
              </Link>
              <Link
                href="/admin/cms/customer-stories"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/customer-stories') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="stories" /></span><span>Customer Stories</span></span>
              </Link>
              <Link
                href="/admin/cms/news-updates"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/news-updates') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="news" /></span><span>News & Updates</span></span>
              </Link>
              <Link
                href="/admin/cms/careers"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/careers') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="careers" /></span><span>Careers</span></span>
              </Link>
              <Link
                href="/admin/cms/support"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/support') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="support" /></span><span>Support</span></span>
              </Link>
              <Link
                href="/admin/cms/contact-us"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/contact-us') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="contact" /></span><span>Contact Us</span></span>
              </Link>
              <Link
                href="/admin/cms/header"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/header') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="header" /></span><span>Header</span></span>
              </Link>
              <Link
                href="/admin/cms/footer"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/cms/footer') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="footer" /></span><span>Footer</span></span>
              </Link>
            </div>
          )}
        </div>
        
        <Link
          href="/admin/managebrands"
          className={`admin-sidebar-link ${pathname?.startsWith('/admin/managebrands') ? 'active' : ''}`}
        >
          <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="brands" /></span><span>Brand Management</span></span>
        </Link>
        
        <Link
          href="/admin/managenews"
          className={`admin-sidebar-link ${pathname?.startsWith('/admin/managenews') ? 'active' : ''}`}
        >
          <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="news" /></span><span>News Management</span></span>
        </Link>
        
        <Link
          href="/admin/managecareers"
          className={`admin-sidebar-link ${pathname?.startsWith('/admin/managecareers') ? 'active' : ''}`}
        >
          <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="careers" /></span><span>Careers Management</span></span>
        </Link>

        <Link
          href="/admin/manageteam"
          className={`admin-sidebar-link ${pathname?.startsWith('/admin/manageteam') ? 'active' : ''}`}
        >
          <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="about" /></span><span>Team Management</span></span>
        </Link>
        
        <Link
          href="/admin/managestories"
          className={`admin-sidebar-link ${pathname?.startsWith('/admin/managestories') ? 'active' : ''}`}
        >
          <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="stories" /></span><span>Stories Management</span></span>
        </Link>
        
        <Link
          href="/admin/managesolutions"
          className={`admin-sidebar-link ${pathname?.startsWith('/admin/managesolutions') ? 'active' : ''}`}
        >
          <span className="admin-sidebar-label"><span className="admin-sidebar-icon"><SidebarIcon name="solutions" /></span><span>Solutions Management</span></span>
        </Link>
        
        <div className={`admin-sidebar-group ${pathname?.startsWith('/admin/enquiries') || pathname?.startsWith('/admin/job-inquiries') ? 'active' : ''}`}>
          <button
            type="button"
            className={`admin-sidebar-group-toggle ${enquiriesOpen ? 'open' : ''}`}
            onClick={() => setEnquiriesOpen(!enquiriesOpen)}
          >
            <span className="admin-sidebar-label">
              <span className="admin-sidebar-icon"><SidebarIcon name="enquiries" /></span>
              <span>Enquiries</span>
            </span>
            <span className="admin-sidebar-arrow">{enquiriesOpen ? '▼' : '▶'}</span>
          </button>
          {enquiriesOpen && (
            <div className="admin-sidebar-submenu">
              <Link
                href="/admin/enquiries"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/enquiries') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label">
                  <span className="admin-sidebar-icon"><SidebarIcon name="enquiries" /></span>
                  <span>Contact Enquiries</span>
                </span>
              </Link>
              <Link
                href="/admin/job-inquiries"
                className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/job-inquiries') ? 'active' : ''}`}
              >
                <span className="admin-sidebar-label">
                  <span className="admin-sidebar-icon"><SidebarIcon name="careers" /></span>
                  <span>Job Inquiries</span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
