"use client";

import React from "react";

const services = [
  {
    icon: "🌿",
    title: "Gardener",
    description: "Lawn care, plant maintenance, trimming, and garden clean up.",
  },
  {
    icon: "⚡",
    title: "Electrician",
    description: "Wiring, fan & light installation, switchboard repair, and troubleshooting.",
  },
  {
    icon: "🎨",
    title: "Painter",
    description: "Interior & exterior painting, wall finishing, and touch-up services.",
  },
  {
    icon: "🔧",
    title: "Plumber",
    description: "Leak repair, pipe installation, drainage issues, and bathroom fittings.",
  },
  {
    icon: "🪵",
    title: "Carpenter",
    description: "Furniture repair, custom woodwork, doors, shelves, and fittings.",
  },
  {
    icon: "🧹",
    title: "Cleaner",
    description: "Home, office, deep cleaning, and sanitization services.",
  },
  {
    icon: "🚗",
    title: "Car Wash",
    description: "Exterior & interior car cleaning, polishing and detailing.",
  },
  {
    icon: "🐛",
    title: "Pest Control",
    description: "Termite, rodent, insect, and mosquito control treatments.",
  },
  {
    icon: "❄️",
    title: "HVAC",
    description: "AC installation, servicing, repair, and maintenance.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-white">
      <div className="section-container">
        <h2 className="heading-section">
          All Home
          <span className="text-blue"> Services </span>
          in One App
        </h2>

        <div className="grid-services">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card"
            >
              <div className="service-card-header">
                <div className="service-avatar">
                  <span className="service-avatar-icon">{service.icon}</span>
                </div>
                <h3 className="service-title">{service.title}</h3>
              </div>
              <div className="service-card-body">
                <p className="service-description">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-cta">
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
}

