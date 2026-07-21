import AdminLogin from "@/components/admin/AdminLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Al Bahar & Partners",
  description: "Admin login portal for Al Bahar & Partners",
};

export default function AdminLoginPage() {
  return (
    <div className="admin-login-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-1)" }}>
      <AdminLogin />
    </div>
  );
}
