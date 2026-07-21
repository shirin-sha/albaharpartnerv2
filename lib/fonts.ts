import {
  Archivo,
  Geologica,
  Inter_Tight,
  Nunito,
  Noto_Sans_Arabic,
  Oxygen,
  Rethink_Sans,
  SUSE,
} from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rethink-sans",
  display: "swap",
});

const oxygen = Oxygen({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-oxygen",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const suse = SUSE({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-suse",
  display: "swap",
});

const geologica = Geologica({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geologica",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
});

/** Apply on `<html>` so CSS variables are available site-wide. */
export const siteFontVariablesClassName = [
  archivo.variable,
  rethinkSans.variable,
  oxygen.variable,
  interTight.variable,
  suse.variable,
  geologica.variable,
  nunito.variable,
  notoSansArabic.variable,
].join(" ");
