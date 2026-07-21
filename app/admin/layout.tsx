import { ReactNode } from "react";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import "@/components/admin/ui/admin-styles.css";
import "@/public/scss/admin.scss";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
