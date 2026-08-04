import RtlToggler from "@/components/common/RtlToggler";
import "../public/scss/main.scss";
import { siteFontVariablesClassName } from "@/lib/fonts";

import GlobalEffectsProvider from "@/components/common/GlobalEffectsProvider";
import ScrollTop from "@/components/common/ScrollTop";
import Context from "@/context/Context";
import { rtlInitScript } from "@/lib/rtl-init";
import DeferredGlobalOverlays from "@/components/common/DeferredGlobalOverlays";
import DeferredMobileMenu from "@/components/common/DeferredMobileMenu";

import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Al Bahar & Partners - Technology Solutions",
  description:
    "Al Bahar & Partners delivers enterprise technology solutions, consulting, and managed services across Kuwait and the GCC.",
  icons: {
    icon: "/image/logo/favicon.png",
    shortcut: "/image/logo/favicon.png",
    apple: "/image/logo/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={siteFontVariablesClassName}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: rtlInitScript }} />
      </head>
      <body className={`counter-scroll popup-loader`}>
        <div className="wrapper">
          <Context>
            <RtlToggler />
            <main id="main-content">{children}</main>
            <DeferredMobileMenu />
            <DeferredGlobalOverlays />
            <ScrollTop />{" "}
          </Context>
          <GlobalEffectsProvider />
        </div>
      </body>
    </html>
  );
}
