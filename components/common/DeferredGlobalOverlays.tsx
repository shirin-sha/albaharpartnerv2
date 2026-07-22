"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Quickview = dynamic(() => import("@/components/modals/Quickview"));
const Search = dynamic(() => import("@/components/modals/Search"));

export default function DeferredGlobalOverlays() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const enable = () => setShouldLoad(true);
    const shouldEnableForTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;

      return Boolean(
        target.closest(
          '[href="#canvnasQuickview"], [data-search-trigger], .search-trigger'
        )
      );
    };

    const handleIntent = (event: Event) => {
      if (shouldEnableForTarget(event.target)) {
        enable();
      }
    };

    window.addEventListener("pointerover", handleIntent, { passive: true });
    window.addEventListener("focusin", handleIntent);
    window.addEventListener("pointerdown", handleIntent, { passive: true });

    return () => {
      window.removeEventListener("pointerover", handleIntent);
      window.removeEventListener("focusin", handleIntent);
      window.removeEventListener("pointerdown", handleIntent);
    };
  }, []);

  return (
    <>
      {shouldLoad && (
        <>
          <Quickview />
          <Search />
        </>
      )}
    </>
  );
}

