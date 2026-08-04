import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SolutionsContent } from "@/types/solutions";

interface Props {
  data: SolutionsContent;
  language?: 'ltr' | 'rtl';
}

export default function ServicesCMS({ data, language = 'ltr' }: Props) {
  if (!data.isActive) return null;

  const solutions = (data.solutions || []).filter((solution) => solution.isActive);
  const detailsBasePath = language === 'rtl' ? '/ar/services-details-1' : '/services-details-1';

  if (solutions.length === 0) return null;

  return (
    <div className="tf-container">
      <div className="row">
        <div className="col-12">
          <div className="solutions-grid tf-spacing-2">
            <div className="row g-4">
              {solutions.map((solution, index) => (
                <div
                  className="col-lg-4 col-md-6 col-12"
                  key={solution.id || index}
                >
                  <Link
                    href={`${detailsBasePath}/${solution.id}`}
                    className="solution-grid-card"
                  >
                    <div className="solution-grid-image">
                      <Image
                        src={solution.imgSrc}
                        alt={solution.title}
                        className="lazyload"
                        width={solution.imgWidth || 640}
                        height={solution.imgHeight || 400}
                      />
                    </div>
                    <div className="solution-grid-body">
                      <h3 className="solution-grid-title">{solution.title}</h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
