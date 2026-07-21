import { ReactNode } from "react";

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      {children}
    </html>
  );
}
