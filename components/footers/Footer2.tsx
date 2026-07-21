"use client";

import React, { useEffect, useMemo, useState } from "react";
import FooterCMS from "./FooterCMS";
import { FooterContent } from "@/types/footer";

interface Footer2Props {
  parentClass?: string;
  light?: boolean;
  language?: "ltr" | "rtl";
}

export default function Footer2({
  parentClass = "footer style-2",
  light = false,
  language,
}: Footer2Props) {
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);

  const resolvedLanguage = useMemo<"ltr" | "rtl">(() => {
    if (language) return language;
    if (typeof document !== "undefined") {
      return document.documentElement.dir === "rtl" ? "rtl" : "ltr";
    }
    return "ltr";
  }, [language]);

  useEffect(() => {
    let isMounted = true;

    const loadFooter = async () => {
      try {
        const res = await fetch(`/api/footer?language=${resolvedLanguage}`);
        const result = await res.json();
        if (isMounted && result?.success && result?.data) {
          setFooterContent(result.data);
        }
      } catch (error) {
        console.error("Failed to load footer content:", error);
      }
    };

    loadFooter();
    return () => {
      isMounted = false;
    };
  }, [resolvedLanguage]);

  if (!footerContent) return null;

  return <FooterCMS data={footerContent} parentClass={parentClass} light={light} />;
}
