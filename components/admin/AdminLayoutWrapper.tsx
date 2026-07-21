'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const authCheckedRef = useRef(false);

  // Memoize login page check
  const isLoginPage = useMemo(() => pathname === "/admin", [pathname]);

  // Optimize auth check - only run once on mount, not on every navigation
  useEffect(() => {
    // Skip if already checked
    if (authCheckedRef.current) {
      return;
    }

    // Skip auth check for login page
    if (isLoginPage) {
      setIsAuthenticated(true);
      authCheckedRef.current = true;
      return;
    }

    // Check authentication synchronously (localStorage is fast)
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token || !userData) {
      setIsAuthenticated(false);
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
    }
    
    authCheckedRef.current = true;
  }, [isLoginPage, router]);

  // Show loading only briefly while checking authentication (first time only)
  if (isAuthenticated === null && !isLoginPage) {
    return <div className="admin-loading">Loading...</div>;
  }

  // Login page - render without sidebar/header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not login page, don't render (redirect will happen)
  if (isAuthenticated === false) {
    return null;
  }

  // Dashboard and other admin pages - render with sidebar/header
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
      <AdminHeader />
        <main className="admin-main-content">{children}</main>
        </div>
    </div>
  );
}
