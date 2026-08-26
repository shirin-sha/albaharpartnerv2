import React from "react";
import Breadcumb from "@/components/common/Breadcumb";

export type PageTitleBannerProps = {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  /** CMS breadcrumb / page-header background. Falls back to theme `bg-img-8` when empty. */
  imagePath?: string;
  isActive?: boolean;
};

/** Shared className/style for page-title banners that need custom inner markup. */
export function getPageTitleBg(
  imagePath?: string,
  fallbackClass = "bg-img-8"
): { className: string; style?: React.CSSProperties } {
  const cmsBg = imagePath?.trim();
  if (!cmsBg) {
    return { className: `page-title style-1 ${fallbackClass}` };
  }
  return {
    className: "page-title style-1 has-cms-bg",
    style: {
      ["--page-title-bg" as string]: `url("${cmsBg}")`,
    } as React.CSSProperties,
  };
}

export default function PageTitleBanner({
  breadcrumb,
  title,
  subtitle,
  imagePath,
  isActive = true,
}: PageTitleBannerProps) {
  if (!isActive) return null;

  const { className, style } = getPageTitleBg(imagePath);

  const subtitleHtml = subtitle
    ? subtitle.includes("<")
      ? subtitle
      : subtitle.replace(/\n/g, "<br />")
    : "";

  return (
    <div className={className} style={style}>
      <div className="tf-container">
        <div className="page-title-content">
          <Breadcumb pageName={breadcrumb} />
          <h2 className="title-page-title">{title}</h2>
          {subtitleHtml ? (
            <div
              className="sub-title body-2"
              dangerouslySetInnerHTML={{ __html: subtitleHtml }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
