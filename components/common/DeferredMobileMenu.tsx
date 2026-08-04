"use client";

import dynamic from "next/dynamic";

const MobileMenu = dynamic(() => import("@/components/modals/MobileMenu"), {
  ssr: false,
});

export default function DeferredMobileMenu() {
  return <MobileMenu />;
}
