import Link from "next/link";
import React, { Suspense } from "react";
import { CareersContent } from "@/types/careers";
import CareerApplyForm from "@/components/otherPages/CareerApplyForm";

interface Props {
  data: CareersContent;
}

export default function CareerCMS({ data }: Props) {
  if (!data.isActive) return null;
  const isArabic = data.language === "rtl";
  const labels = {
    jobDescription: isArabic ? "الوصف الوظيفي" : "Job Description",
    work: isArabic ? "المهام الوظيفية" : "The Work You'll Do",
    salary: isArabic ? "الراتب" : "Salary",
    applyNow: isArabic ? "قدم الآن" : "Apply Job Now",
  };

  const activeJobs = (data.jobs || [])
    .filter(job => job.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeJobs.length === 0) return null;

  return (
    <section className="section-new page-career bg-surface tf-spacing-2">
      <div className="tf-container position-relative">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <div className="text-anime-wave-1">
                <span className="tag label text-btn-uppercase bg-white">{data.tag}</span>
              </div>
              <h3 className="text-anime-wave-1 mb-12">
                {data.heading}
              </h3>
              {data.subheading && (
                <div className="sub-title body-2 text-anime-wave-1">
                  {data.subheading}
                </div>
              )}
            </div>
            <div className="wg-according" id="According1">
              {activeJobs.map((job, index) => (
                <div className="according-item bg-white style-arrow" key={job._id || index}>
                  <h5>
                    <a
                      href={`#according${index + 1}`}
                      data-bs-toggle="collapse"
                      className={index === 0 ? "title-according" : "title-according collapsed"}
                    >
                      {job.title}
                      <i className="icon-chevron-down" />
                    </a>
                  </h5>
                  <div
                    id={`according${index + 1}`}
                    className={index === 0 ? "collapse show" : "collapse"}
                    data-bs-parent="#According1"
                  >
                    <div className="according-content">
                      <div className="content">
                        <div className="job-description item-content item-content-1">
                          <h6 className="title-item">{labels.jobDescription}</h6>
                          <div className="text body-2" dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />
                        </div>
                        {job.responsibilities && job.responsibilities.length > 0 && (
                          <div className="item-content item-content-1">
                            <h6 className="title-item">{labels.work}</h6>
                            <ul>
                              {job.responsibilities.map((responsibility, respIndex) => (
                                <li className="body-2" key={respIndex}>
                                  {responsibility}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="item-content item-content-2">
                          <h6 className="title-item">{labels.salary}</h6>
                          <div className="price-according mb-20">
                            <h5 className="salary-amount">{job.salary.amount}</h5>
                            <span className="salary-period">{job.salary.period}</span>
                          </div>
                          <Link
                            href={
                              job.applyLink && job.applyLink !== "#"
                                ? job.applyLink
                                : `/career?job=${encodeURIComponent(job.title)}#apply-now`
                            }
                            className="tf-btn style-1 bg-color-primary"
                          >
                            <span> {labels.applyNow} </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Suspense fallback={<div id="apply-now" className="mt-40" />}>
              <CareerApplyForm jobs={activeJobs} language={data.language} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
