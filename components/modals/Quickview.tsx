"use client";
import { useContextElement } from "@/context/Context";

import Image from "next/image";
import React, { useState } from "react";
const colorOptions = [
  {
    id: "type-1",
    src: "/image/type-color-item/type-1.jpg",
    width: 40,
    height: 41,
  },
  {
    id: "type-2",
    src: "/image/type-color-item/type-2.jpg",
    width: 38,
    height: 39,
  },
  {
    id: "type-3",
    src: "/image/type-color-item/type-3.jpg",
    width: 40,
    height: 41,
  },
];

export default function Quickview() {
  const [selected, setSelected] = useState("type-2"); // default active
  const [value, setValue] = useState(1);
  const { quickViewItem, addProductToCart, isAddedToCartProducts } =
    useContextElement();
  return (
    <div
      className="offcanvas offcanvas-end canvnas-quick-view"
      id="canvnasQuickview"
    >
      <div className="canvnas-content">
        <div className="tf-minicart-recommendations">
          <div className="wrap-recommendations">
            <div className="list-img">
              <div className="list-img-item">
                <div className="image">
                  <Image
                    className="lazyloaded"
                    alt={quickViewItem.title}
                    src={quickViewItem.imgSrc}
                    width={360}
                    height={360}
                  />
                </div>
              </div>
              <div className="list-img-item">
                <div className="image">
                  <Image
                    className="lazyloaded"
                    data-src="/image/quick-view-img/img-quickview-2.jpg"
                    alt=""
                    src="/image/quick-view-img/img-quickview-2.jpg"
                    width={340}
                    height={340}
                  />
                </div>
              </div>
              <div className="list-img-item">
                <div className="image">
                  <Image
                    className="lazyloaded"
                    data-src="/image/quick-view-img/img-quickview-3.jpg"
                    alt=""
                    src="/image/quick-view-img/img-quickview-3.jpg"
                    width={340}
                    height={340}
                  />
                </div>
              </div>
              <div className="list-img-item">
                <div className="image">
                  <Image
                    className="lazyloaded"
                    data-src="/image/quick-view-img/img-quickview-4.jpg"
                    alt=""
                    src="/image/quick-view-img/img-quickview-4.jpg"
                    width={358}
                    height={358}
                  />
                </div>
              </div>
              <div className="list-img-item">
                <div className="image">
                  <Image
                    className="lazyloaded"
                    data-src="/image/quick-view-img/img-quickview-1.jpg"
                    alt=""
                    src="/image/quick-view-img/img-quickview-1.jpg"
                    width={360}
                    height={360}
                  />
                </div>
              </div>
              <div className="list-img-item">
                <div className="image">
                  <Image
                    className="lazyloaded"
                    data-src="/image/quick-view-img/img-quickview-2.jpg"
                    alt=""
                    src="/image/quick-view-img/img-quickview-2.jpg"
                    width={340}
                    height={340}
                  />
                </div>
              </div>
              <div className="list-img-item">
                <div className="image">
                  <Image
                    className="lazyloaded"
                    data-src="/image/quick-view-img/img-quickview-3.jpg"
                    alt=""
                    src="/image/quick-view-img/img-quickview-3.jpg"
                    width={340}
                    height={340}
                  />
                </div>
              </div>
              <div className="list-img-item">
                <div className="image">
                  <Image
                    className="lazyloaded"
                    data-src="/image/quick-view-img/img-quickview-4.jpg"
                    alt=""
                    src="/image/quick-view-img/img-quickview-4.jpg"
                    width={358}
                    height={358}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="quick-view-content">
          <div className="heading-quick-view">
            <h5>Quick View</h5>
            <button
              className="mobile-nav-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <i className="icon-close1" />
            </button>
          </div>
          <div className="tf-product-info-wrap">
            <div className="tf-product-info-sold">
              <div className="icon">
                <i className="icon-Lightning" />
              </div>
              <div className="text">
                18&nbsp;sold in last&nbsp;32&nbsp;hours
              </div>
            </div>
            <div className="tf-product-info-heading">
              <h4 className="name-product">{quickViewItem.title}</h4>
            </div>
            <div className="tf-product-info-desc">
              <div className="tf-product-info-price">
                <h4 className="price-on-sale font-2 cart-price">
                  ${quickViewItem.price.toFixed()}
                </h4>
                {quickViewItem.oldPrice ? (
                  <>
                    <h5 className="compare-at-price font-2">
                      ${quickViewItem.oldPrice.toFixed(2)}
                    </h5>
                    <div className="badges-on-sale text-btn-uppercase">
                      -25%
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
              <p>
                The most popular organization items sold together in a set at a
                discounted price. Each piece is made to sit flush with each
                other and can be re-arranged to fit...
              </p>
            </div>
            <div className="tf-product-info-choose-option">
              <div className="variant-picker-item">
                <div className="variant-picker-label title">
                  Type:
                  <span className="text-title">White Oak</span>
                </div>
                <div className="variant-picker-values">
                  {colorOptions.map((option) => (
                    <React.Fragment key={option.id}>
                      <input
                        type="radio"
                        checked={selected === option.id}
                        readOnly
                      />
                      <label
                        onClick={() => setSelected(option.id)}
                        className={`hover-tooltip tooltip-bot color-btn ${
                          selected === option.id ? "active" : ""
                        }`}
                      >
                        <button type="button" className="image" aria-label={`Select ${option.id}`}>
                          <Image
                            src={option.src}
                            alt=""
                            className="lazyload"
                            width={option.width}
                            height={option.height}
                          />
                        </button>
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="tf-product-info-quantity">
                <div className="title">Quantity:</div>
                <div className="wg-quantity">
                  <span
                    className="btn-quantity btn-decrease"
                    onClick={() => setValue((pre) => (pre == 1 ? 1 : pre - 1))}
                  >
                    -
                  </span>
                  <input
                    className="quantity-product"
                    type="text"
                    name="number"
                    value={value}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v > 0) {
                        setValue(v);
                      }
                    }}
                  />
                  <span
                    className="btn-quantity btn-increase"
                    onClick={() => setValue((pre) => pre + 1)}
                  >
                    +
                  </span>
                </div>
              </div>
              <div>
                <div className="tf-product-info-by-btn ">
                  <button
                    type="button"
                    onClick={(e) => {
                      addProductToCart(quickViewItem.id, value);
                    }}
                    className="tf-btn style-2 w-full text-center bg-color-primary btn-add-to-cart"
                  >
                    <span>
                      {isAddedToCartProducts(quickViewItem.id)
                        ? "Already Added"
                        : "Add To Cart"}{" "}
                      -&nbsp;
                    </span>
                    <span className="cart-total tf-qty-price total-price">
                      ${(quickViewItem.price * value).toFixed(2)}
                    </span>
                  </button>
                  <a
                    href="#compare"
                    data-bs-toggle="offcanvas"
                    className="box-icon hover-tooltip compare btn-icon-action"
                    aria-label="Open product comparison"
                  >
                    <span className="visually-hidden">Open product comparison</span>
                    <i className="icon icon-gitDiff" aria-hidden />
                  </a>
                  <button
                    type="button"
                    className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                    aria-label="Add to wishlist"
                  >
                    <i className="icon icon-heart" />
                  </button>
                </div>
                <button
                  type="button"
                  className="tf-btn w-full style-2 bg-on-suface-container text-center"
                  aria-label="Buy now"
                >
                  <span>Buy It Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
