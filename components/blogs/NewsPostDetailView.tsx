import Link from "next/link";
import Image from "next/image";
import React from "react";
import type { NewsPost } from "@/types/news-updates";
import { newsMainImageSrc } from "@/lib/news-post-images";
import Breadcumb from "@/components/common/Breadcumb";
import CmsRichText from "@/components/common/CmsRichText";

function formatDate(p: { dateIso?: string; date: { day: string; month: string } }) {
  if (p.dateIso) {
    const d = new Date(p.dateIso);
    if (!Number.isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = String(d.getFullYear()).slice(-2);
      return `${dd}/${mm}/${yy}`;
    }
  }
  const monthMap: Record<string, string> = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  };
  const dd = String(p.date?.day || "").padStart(2, "0");
  const mm = monthMap[(p.date?.month || "").toUpperCase()] || "01";
  return `${dd}/${mm}/${String(new Date().getFullYear()).slice(-2)}`;
}

function postHref(postsPathPrefix: string, p: NewsPost, index: number) {
  return `${postsPathPrefix}/${p._id || String(index + 1)}`;
}

export interface NewsPostDetailViewProps {
  post: NewsPost;
  activePosts: NewsPost[];
  postsPathPrefix: string;
  breadcrumbPageName: string;
  listingTitle: string;
  recentPostsTitle: string;
  language?: "ltr" | "rtl";
}

export default function NewsPostDetailView({
  post,
  activePosts,
  postsPathPrefix,
  breadcrumbPageName,
  listingTitle,
  recentPostsTitle,
  language = "ltr",
}: NewsPostDetailViewProps) {
  const detailHeroSrc = newsMainImageSrc(post);

  return (
    <>
      <div className="page-title style-1 bg-img-8">
        <div className="tf-container">
          <div className="page-title-content">
            <Breadcumb pageName={breadcrumbPageName} />
            <h2 className="title-page-title">{listingTitle}</h2>
          </div>
        </div>
      </div>

      <div className="main-content tf-spacing-2" dir={language}>
        <div className="tf-container tf-spacing-3">
          <div className="row rg-60">
            <div className="col-xl-9">
              <div className="blog-content blog-details-content mr-50">
                {detailHeroSrc && (
                  <div className="image-blog">
                    <Image
                      src={detailHeroSrc}
                      alt={post.title}
                      width={910}
                      height={512}
                      priority
                      quality={72}
                      sizes="(max-width: 1199px) 100vw, 910px"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                )}
                <div className="meta mb-20">
                  <div className="meta-content">
                    <div className="icon">
                      <i className="icon-calendarBlank" />
                    </div>
                    <div className="text body-2">{formatDate(post)}</div>
                  </div>
                  <div className="meta-content">
                    <div className="icon">
                      <i className="icon-price-tag" />
                    </div>
                    <div className="text body-2">{post.category}</div>
                  </div>
                </div>
                <div className="desc-blog">
                  <h4 className="title-desc mb-20">{post.title}</h4>
                  {post.longDescription && (
                    <CmsRichText html={post.longDescription} className="body-2 mt-20" />
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="tf-sidebar style-position-sticky top-140 news-details-sidebar">
                <div className="sidebar-item sidebar-content sidebar-recent-posts">
                  <h6 className="title-content">{recentPostsTitle}</h6>
                  {activePosts
                    .filter((p) => p !== post)
                    .slice(0, 4)
                    .map((recentPost, index) => {
                      const absoluteIndex = activePosts.findIndex((p) => p === recentPost);
                      const href = postHref(
                        postsPathPrefix,
                        recentPost,
                        absoluteIndex >= 0 ? absoluteIndex : index
                      );
                      const thumbSrc = newsMainImageSrc(recentPost);
                      return (
                        <div
                          className="tf-post-list style-small hover-img"
                          key={recentPost._id || index}
                        >
                          <div className="image">
                            <Link href={href} className="link">
                              <span className="visually-hidden">{`Read article: ${recentPost.title}`}</span>
                            </Link>
                            {thumbSrc && (
                              <Image
                                src={thumbSrc}
                                alt={recentPost.title}
                                width={120}
                                height={90}
                                className="lazyload"
                                loading="lazy"
                                quality={65}
                                sizes="120px"
                              />
                            )}
                          </div>
                          <div className="post-content">
                            <div className="post-date caption-1">{formatDate(recentPost)}</div>
                            <Link href={href} className="name-post">
                              {recentPost.title}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function NewsPostNotFound({
  backHref,
  notFoundTitle,
  notFoundCta,
}: {
  backHref: string;
  notFoundTitle: string;
  notFoundCta: string;
}) {
  return (
    <div className="tf-container tf-spacing-2">
      <h3>{notFoundTitle}</h3>
      <Link href={backHref} className="tf-btn style-1 bg-color-primary">
        <span>{notFoundCta}</span>
      </Link>
    </div>
  );
}
