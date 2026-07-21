"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CustomerStoriesContent } from "@/types/customer-stories";

interface Props {
  data: CustomerStoriesContent;
}

export default function CustomerStoriesCMS({ data }: Props) {
  const [filteres, setFilteres] = useState<typeof data.stories>([]);
  const [isLoadedMore, setIsLoadedMore] = useState(false);

  useEffect(() => {
    if (isLoadedMore) {
      setFilteres(data.stories.filter(s => s.isActive).sort((a, b) => a.order - b.order));
    } else {
      setFilteres(data.stories.filter(s => s.isActive).sort((a, b) => a.order - b.order).slice(0, 6));
    }
  }, [isLoadedMore, data.stories]);

  if (!data.isActive) return null;

  const activeStories = data.stories.filter(s => s.isActive).sort((a, b) => a.order - b.order);
  if (activeStories.length === 0) return null;

  return (
    <div className="page-case-content tf-spacing-2">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {data.tag && data.heading && (
              <div className="heading-section text-center mb-60">
                <div className="text-anime-wave-1">
                  <span className="tag label text-btn-uppercase bg-white">{data.tag}</span>
                </div>
                <h3 className="title-section text-anime-wave-1 mb-12">
                  {data.heading}
                </h3>
                {data.subheading && (
                  <div className="sub-title body-2 text-anime-wave-1">
                    {data.subheading}
                  </div>
                )}
              </div>
            )}
            <div className="flat-animate-tab">
              <div className="case-list">
                <div className="layout-grid-3 g-30 loadmore-item style-2 mb-40">
                  {filteres.map((story, index) => (
                  (() => {
                    const storyHref =
                      story.link && story.link.trim() !== "#" ? story.link : "/customer-stories";
                    return (
                    <div
                      className="case-studies-item style-bg-content hover-img fl-item"
                      style={{ display: "block" }}
                      key={story._id || index}
                    >
                      <div className="image">
                        <Image
                          src={story.imagePath}
                          alt={story.title}
                          className="lazyload"
                          width={473}
                          height={630}
                        />
                        <Link
                          href={storyHref}
                          className="link"
                          aria-label={`View story ${story.title}`}
                        />
                      </div>
                      <Link
                        href={storyHref}
                        className="btn-arrow-item"
                        aria-label={`Open story ${story.title}`}
                      >
                        <i className="icon-arrowRight" />
                      </Link>
                      <div className="case-studies-content">
                        <h5>
                          <Link
                            href={storyHref}
                            className="name"
                          >
                            {story.title}
                          </Link>
                        </h5>
                        <div className="desc">{story.description}</div>
                      </div>
                    </div>
                    );
                  })()
                ))}
                </div>
                {!isLoadedMore && activeStories.length > 6 && (
                  <div
                    onClick={() => setIsLoadedMore(true)}
                    className="btn-load-more text-center view-more-button"
                  >
                    <button className="tf-btn style-1 bg-color-primary btn-loadmore">
                      <span>Load More</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
