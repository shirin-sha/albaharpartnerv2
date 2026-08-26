"use client";

import MobileMenu from "@/components/modals/MobileMenu";

/** Mobile offcanvas must mount with the page — do not defer via dynamic(ssr:false). */
export default function DeferredMobileMenu() {
  return <MobileMenu />;
}
