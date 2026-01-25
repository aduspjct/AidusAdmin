"use client";

import React from "react";
import Image from "next/image";

const businessPoints = [
  { icon: "📍", text: "Get nearby job requests" },
  { icon: "💰", text: "Receive secure payments" },
  { icon: "📅", text: "Work on your own schedule" },
  { icon: "📊", text: "Track earnings & bookings" },
  { icon: "⭐", text: "Build your rating & reviews" },
];

export default function BusinessGrowSection() {
  return (
    <section id="business-grow" className="section-white business-grow-section">
      <div className="section-container">
        <div className="grid-responsive items-center">
          {/* Left: Business Points */}
          <div className="relative">
            <h2 className="business-grow-heading">
              Grow Your <span className="text-blue">Business</span> with Us
            </h2>
            <ul className="mb-10">
              {businessPoints.map((point, index) => (
                <li key={index} className="business-point-item">
                  <span className="business-point-icon">{point.icon}</span>
                  <span className="business-point-text">{point.text}</span>
                </li>
              ))}
            </ul>

            
            <button className="btn-primary-lg">
              Register as a Provider
            </button>


          </div>

          <div className="image-container image-container-right">
            <Image
              src="/images/landing/service/grow_business.png"
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

