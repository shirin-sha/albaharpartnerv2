"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RtlToggler() {
  const pathname = usePathname();
  const router = useRouter();
  const isRtl = pathname?.startsWith('/ar') || false;
  
  // Hide RTL toggle button on admin pages
  const isAdminPage = pathname?.startsWith('/admin') || false;
  if (isAdminPage) {
    return null;
  }

  useEffect(() => {
    // Apply RTL/LTR direction based on route
    const html = document.documentElement;
    html.setAttribute("dir", isRtl ? "rtl" : "ltr");
    if (isRtl) {
      html.classList.add("rtl");
    } else {
      html.classList.remove("rtl");
    }
  }, [isRtl]);

  const toggleLanguage = () => {
    if (isRtl) {
      // Switch to LTR - remove /ar prefix
      const newPath = pathname?.replace(/^\/ar/, '') || '/';
      router.push(newPath);
    } else {
      // Switch to RTL - add /ar prefix
      const newPath = `/ar${pathname === '/' ? '' : pathname}`;
      router.push(newPath);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      id="toggle-rtl"
      className="btn-style-2 radius-3"
      aria-label={isRtl ? "Switch site language to English" : "Switch site language to Arabic"}
    >
      <span>AR</span>
      <span>EN</span>
    </button>
  );
}
