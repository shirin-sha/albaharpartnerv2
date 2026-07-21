"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { NewsUpdatesContent } from "@/types/news-updates";
import { newsMainImageSrc } from "@/lib/news-post-images";

interface Props {
  data: NewsUpdatesContent;
  /** Base path for post detail links (no trailing slash). Default `/news-updates`. */
  postsBasePath?: string;
}

export default function NewsUpdatesCMS({ data, postsBasePath = "/news-updates" }: Props) {
  const [isLoadedMore, setIsLoadedMore] = useState(false);

  const { activePosts, featuredPost, remainingPosts, filteredPosts } = useMemo(() => {
    const active = data.posts.filter((p) => p.isActive);
    if (active.length === 0) {
      return {
        activePosts: active,
        featuredPost: null as (typeof active)[number] | null,
        remainingPosts: [] as typeof active,
        filteredPosts: [] as typeof active,
      };
    }
    const featuredIndex = active.findIndex((p) => p.isFeatured === true);
    const featured = featuredIndex >= 0 ? active[featuredIndex] : active[0];
    const remaining = active.filter((p) => p !== featured);
    const filtered = isLoadedMore ? remaining : remaining.slice(0, 5);
    return {
      activePosts: active,
      featuredPost: featured,
      remainingPosts: remaining,
      filteredPosts: filtered,
    };
  }, [data.posts, isLoadedMore]);

  if (!data.isActive) return null;
  if (activePosts.length === 0 || !featuredPost) return null;

  const featuredIndex = activePosts.findIndex((p) => p.isFeatured === true);
  const featuredPostHref = getPostHref(
    postsBasePath,
    featuredPost,
    featuredIndex >= 0 ? featuredIndex : 0
  );
  // Featured card uses featured image when available, otherwise falls back to main image.
  const heroSrc = featuredPost.imagePath?.trim() || newsMainImageSrc(featuredPost);

  const getDateBadgeParts = (post: (typeof activePosts)[number]) => {
    if (post.dateIso) {
      const d = new Date(post.dateIso);
      if (!Number.isNaN(d.getTime())) {
        const dd = String(d.getDate()).padStart(2, "0");
        const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
        return { day: dd, month };
      }
    }
    const dd = String(post.date?.day || "").padStart(2, "0");
    const month = (post.date?.month || "JAN").toUpperCase();
    return { day: dd, month };
  };

  return (
    <div className="tf-container">
      <div className="row">
        <div className="col-12">
          <div className="blog-content blog-no-sidebar-content">
            <div className="blog-no-sidebar-slide">
              <div className="tf-post-grid style-absolute news-featured-post">
                <div className="image">
                  <Link href={featuredPostHref} className="link">
                    <span className="visually-hidden">{`Read article: ${featuredPost.title}`}</span>
                  </Link>
                  {heroSrc && (
                    <Image
                      src={heroSrc}
                      alt={featuredPost.title}
                      width={featuredPost.imgWidth || 1290}
                      height={featuredPost.imgHeight || 600}
                      className="lazyload"
                      priority
                      quality={72}
                      sizes="(max-width: 1290px) 100vw, 1290px"
                    />
                  )}
                  <Link href={featuredPostHref} className="date">
                    <span className="visually-hidden">
                      {`Read article: ${featuredPost.title}`}
                    </span>
                    <span className="day">{getDateBadgeParts(featuredPost).day}</span>
                    <span>{getDateBadgeParts(featuredPost).month}</span>
                  </Link>
                </div>
                <div className="tf-post-grid-content">
                  <div className="position">{featuredPost.category}</div>
                  <h4 className="title-post">
                    <Link href={featuredPostHref}>{featuredPost.title}</Link>
                  </h4>
                  {featuredPost.shortDescription && (
                    <div className="sub-title body-2">{featuredPost.shortDescription}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="layout-grid-3 loadmore-item">
              {filteredPosts.map((post, index) => {
                const absoluteIndex = activePosts.findIndex((p) => p === post);
                const href = getPostHref(postsBasePath, post, absoluteIndex >= 0 ? absoluteIndex : index);
                const listSrc = newsMainImageSrc(post);
                return (
                  <div className="tf-post-grid style-small fl-item d-block" key={post._id || index}>
                    <div className="image">
                      <Link href={href} className="link">
                        <span className="visually-hidden">{`Read article: ${post.title}`}</span>
                      </Link>
                      {listSrc && (
                        <Image
                          src={listSrc}
                          alt={post.title}
                          width={post.imgWidth || 410}
                          height={post.imgHeight || 546}
                          className="lazyload"
                          loading="lazy"
                          quality={65}
                          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                        />
                      )}
                      <Link href={href} className="date">
                        <span className="visually-hidden">
                          {`Read article: ${post.title}`}
                        </span>
                        <span className="day">{getDateBadgeParts(post).day}</span>
                        <span>{getDateBadgeParts(post).month}</span>
                      </Link>
                    </div>
                    <div className="tf-grid-post-content">
                      <div className="position caption-1 wow fadeInUp">{post.category}</div>
                      <h5 className="title-post wow fadeInUp">
                        <Link href={href}>{post.title}</Link>
                      </h5>
                      {post.shortDescription && (
                        <div className="sub-title body-2">{post.shortDescription}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {!isLoadedMore && remainingPosts.length > 5 && (
              <div className="btn-load-more text-center view-more-button wow fadeInUp">
                <button
                  onClick={() => setIsLoadedMore(true)}
                  className="tf-btn style-1 bg-color-primary btn-loadmore"
                >
                  <span>Load More</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getPostHref(basePath: string, post: { _id?: string }, index: number) {
  const fallbackId = post._id || String(index + 1);
  return `${basePath.replace(/\/$/, "")}/${fallbackId}`;
}
