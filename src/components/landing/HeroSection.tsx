"use client";

import React from "react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="about" className="hero-section-white hero-section-decorative">
      {/* Decorative Shapes */}
      <Image
        src="/images/landing/shape/shape_1.png"
        width={200}
        height={200}
        className="hero-shape hero-shape-top-left"
        alt=""
        quality={100}
        priority
        unoptimized
      />
      <Image
        src="/images/landing/shape/shape_1.png"
        width={200}
        height={200}
        className="hero-shape hero-shape-bottom-left"
        alt=""
        quality={100}
        priority
        unoptimized
      />
      <Image
        src="/images/landing/shape/shape_2.png"
        width={200}
        height={200}
        className="hero-shape hero-shape-top-right"
        alt=""
        quality={100}
        priority
        unoptimized
      />

      {/* Soft Blur Background Ovals */}
      <div className="hero-blur-oval hero-blur-oval-bottom-left"></div>
      <div className="hero-blur-oval hero-blur-oval-bottom-right"></div>

      <div className="section-container">
        <div className="grid-responsive items-center">
          {/* Left Content */}
          <div className="text-center-mobile hero-content-wrapper">
            <h1 className="heading-hero">
              Book Trusted<br />
              <span className="text-blue">Home Services</span>
              <br />
              Anytime, Anywhere
            </h1>
            <p className="text-description">
              From electricians to plumbers, get verified professionals at your doorstep with transparent pricing and secure payments.
            </p>
            <button className="btn-primary">
              Book Service
            </button>
          </div>

          {/* Right Content - Phone Mockup with Serviceman */}
          <div className="image-container image-container-right hero-image-wrapper">
            <Image
              src="/images/landing/service/home_service_man.png"
              width={692}
              height={611}
              className="image-responsive"
              alt="Service professional"
              quality={100}
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}

