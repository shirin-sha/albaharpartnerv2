import Footer2 from "@/components/footers/Footer2";
import HeaderCMS from "@/components/headers/HeaderCMS";
import Topbar1 from "@/components/headers/Topbar1";
import React from "react";
import { getHeaderContent } from "@/lib/data-fetch";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default async function layout({ children }: LayoutProps) {
  const language: 'ltr' | 'rtl' = 'ltr';
  const headerContent = await getHeaderContent(language);

  return (
    <>
      <Topbar1 />
      {headerContent && <HeaderCMS data={headerContent} />}
      {children}
      <Footer2 />
    </>
  );
}
