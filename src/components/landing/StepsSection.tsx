"use client";

import React from "react";
import Image from "next/image";

export default function StepsSection() {
  return (
    <section className="section-blue">
      <div className="section-container">
        <h2 className="heading-section">
          Follow Simple Steps To Get <span className="text-blue">Fast Service</span>
        </h2>

        <div className="grid-steps">
          {/* Step 1 */}
          <div className="step-blue-container">
            <div className="step-item">
              <div className="step-image-wrapper">
                <Image
                  src="/images/landing/service/service_1.png"
                  width={692}
                  height={611}
                  className="step-image"
                  alt="Choose a Service"
                  quality={100}
                  priority
                  unoptimized
                />
              </div>
              <h3 className="heading-step">Choose a Service</h3>
            </div>
          </div>


          <div className="step-blue-container">
            <div className="step-item">
              <div className="step-image-wrapper">
                <Image
                  src="/images/landing/service/service_2.png"
                  width={692}
                  height={611}
                  className="step-image"
                  alt="Choose a Service"
                  quality={100}
                  priority
                  unoptimized
                />
              </div>
              <h3 className="heading-step">Share Your Requirement</h3>
            </div>
          </div>



          <div className="step-blue-container">
            <div className="step-item">
              <div className="step-image-wrapper">
                <Image
                  src="/images/landing/service/service_3.png"
                  width={692}
                  height={611}
                  className="step-image"
                  alt="Choose a Service"
                  quality={100}
                  priority
                  unoptimized
                />
              </div>
              <h3 className="heading-step">Complete Your Booking</h3>
            </div>
          </div>


        </div>

        <div className="text-center mt-12">
          <button className="btn-cta">
            Download App Now
          </button>
        </div>
      </div>
    </section>
  );
}

