"use client";

import React from "react";
import Image from "next/image";

const trustPoints = [
  "Verified & Background-Checked Providers",
  "Transparent Pricing — No Hidden Charges",
  "Real-Time Booking & Status Tracking",
  "Secure Payments",
  "In-App Chat & Notifications",
  "Easy Cancellations & Refunds",
];

export default function TrustSection() {
  return (
    <section id="why-us" className="section-gray">
      <div className="section-container">
        {/* Single White Card Container */}
        <div className="trust-main-card">
          <div className="trust-card-inner">




            <div className="trust-character-container">
              <Image
                src="/images/landing/service/trust_man.png"
                width={692}
                height={611}
                className="trust-character-image"
                alt="Service professional pointing to phone"
                quality={100}
                priority
                unoptimized
              />
            </div>


            {/* Right: Trust Points */}
            <div className="trust-content-section">
              <h2 className="trust-heading">
                Why People <span className="text-blue">Trust Us</span>
              </h2>
              <ul className="trust-points-list">
                {trustPoints.map((point, index) => (
                  <li key={index} className="trust-point-item">
                    <Image
                      src="/images/landing/shape/arrow.png"
                      width={20}
                      height={20}
                      className="trust-point-icon"
                      alt=""
                      quality={100}
                      unoptimized
                    />
                    <span className="trust-point-text">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="trust-buttons-container">
                <button className="trust-download-btn">
                  <Image
                    src="/images/landing/shape/playstore.png"
                    width={24}
                    height={24}
                    alt="Google Play"
                    quality={100}
                    unoptimized
                  />
                  <div className="trust-btn-divider"></div>
                  <div className="trust-btn-text">
                    <span className="trust-btn-label">GET IT ON</span>
                    <span className="trust-btn-store">Google Play</span>
                  </div>
                </button>
                <button className="trust-download-btn">
                  <Image
                    src="/images/landing/shape/apple.png"
                    width={24}
                    height={24}
                    alt="App Store"
                    quality={100}
                    unoptimized
                  />
                  <div className="trust-btn-divider"></div>
                  <div className="trust-btn-text">
                    <span className="trust-btn-label">GET IT ON</span>
                    <span className="trust-btn-store">App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
