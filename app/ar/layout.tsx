import { ReactNode } from "react";

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return <div dir="rtl">{children}</div>;
}
