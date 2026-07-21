import Link from "next/link";

import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title:
    "Page Not Found || Al Bahar & Partners - Business & Finance Consulting",
  description:
    "",
};
export default function page() {
  return (
    <>
      <div className="main-content">
        <div className="wg-404">
          <div className="inner-404">
            <div className="tf-container position-relative">
              <div className="row">
                <div className="col-12">
                  <div className="content-404">
                    <div className="text-oops">Oops</div>
                    <h3>Something is Missing....</h3>
                    <h6 className="text">
                      The page you are looking for cannot be found. take a break
                      before trying again
                    </h6>
                    <Link href={`/`} className="tf-btn bg-white style-1">
                      <span>Back To Homepage</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
