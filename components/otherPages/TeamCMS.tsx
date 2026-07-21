"use client";

import Image from "next/image";
import { teamMembers } from "@/data/team";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { TeamSection } from "@/types/aboutus";

interface Props {
  data: TeamSection;
}

export default function TeamCMS({ data }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!data.isActive) return null;

  const members = data.members && data.members.length > 0 ? data.members : teamMembers;

  return (
    <section
      className="section-team h-4 tf-spacing-2 section-one-page"
      id="testimonials"
    >
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <div className="text-anime-wave-1">
                <span className="tag label text-btn-uppercase">{data.tag}</span>
              </div>
              <h3 className="title-section text-anime-wave-1 mb-12">
                {data.heading}
              </h3>
              <div className="sub-title body-2 text-anime-wave-1">
                {data.subheading}
              </div>
            </div>
            {isMounted && <Swiper
              dir="ltr"
              className="sw-team-list swiper sw-layout"
              spaceBetween={10}
              breakpoints={{
                0: { slidesPerView: 1 },
                575: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 },
              }}
              modules={[Pagination]}
              pagination={{ clickable: true }}
            >
              {members.map((member, index) => (
                <SwiperSlide key={index}>
                  <div className="team-item style-1">
                    <div className="image">
                      <Image
                        src={member.imgSrc}
                        alt={member.name}
                        width={300}
                        height={300}
                        sizes="(max-width: 575px) 100vw, (max-width: 992px) 50vw, 25vw"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div className="content">
                      <h5 className="name">{member.name}</h5>
                      <p className="position">{member.position}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            }
          </div>
        </div>
      </div>
    </section>
  );
}
