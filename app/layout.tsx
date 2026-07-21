import RtlToggler from "@/components/common/RtlToggler";
import "../public/scss/main.scss";
import "rc-slider/assets/index.css";
import { siteFontVariablesClassName } from "@/lib/fonts";

import GlobalEffectsProvider from "@/components/common/GlobalEffectsProvider";
import ScrollTop from "@/components/common/ScrollTop";
import MobileMenu from "@/components/modals/MobileMenu";
import Context from "@/context/Context";
import LoginModal from "@/components/modals/LoginModal";
import { rtlInitScript } from "@/lib/rtl-init";
import DeferredGlobalOverlays from "@/components/common/DeferredGlobalOverlays";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Al Bahar & Partners - Technology Solutions",
  icons: {
    icon: "/image/logo/favicon.png",
    shortcut: "/image/logo/favicon.png",
    apple: "/image/logo/favicon.png",
  },
};
import { ReactNode } from "react";

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
            <MobileMenu />
            {/* <LoginModal /> */}
            <DeferredGlobalOverlays />
            <ScrollTop />{" "}
          </Context>
          <GlobalEffectsProvider />
        </div>
      </body>
    </html>
  );
}
