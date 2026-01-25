"use client";

import React, { useState } from "react";

const testimonials = [
  {
    quote: "I've tried multiple home service apps before, but this one genuinely stands out. Booking was smooth, pricing was transparent, and the cleaner arrived exactly on time.",
    rating: 4.5,
    name: "Sarah Johnson",
  },
  {
    quote: "What I love most about this app is transparency. The service details, estimated pricing, and provider profile gave me confidence before booking. The plumber arrived well-equipped, resolved the leakage efficiently, and even shared maintenance tips.",
    rating: 4.5,
    name: "Michael Chen",
  },
  {
    quote: "As a working professional, I rarely get time to visit salons. Booking beauty services at home through this app has been a game-changer. The beautician was punctual, professional, and used high-quality products.",
    rating: 4.5,
    name: "Emily Davis",
  },
  {
    quote: "Great platform, easy to use, and reliable professionals.",
    rating: 4.7,
    name: "David Wilson",
  },
  {
    quote: "Affordable prices and quality service. Will definitely use again!",
    rating: 4.6,
    name: "Lisa Anderson",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-container">
        <h2 className="heading-section">
          What Our <span className="text-blue">Users</span> Say
        </h2>

        <div className="testimonials-wrapper">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="testimonials-arrow testimonials-arrow-left"
            aria-label="Previous testimonial"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className="testimonials-arrow testimonials-arrow-right"
            aria-label="Next testimonial"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonials Grid */}
          <div className="testimonials-grid">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card-premium">
                <div className="testimonial-rating-row">
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`testimonial-star ${i < Math.floor(testimonial.rating)
                          ? "testimonial-star-filled"
                          : i < testimonial.rating
                            ? "testimonial-star-half"
                            : "testimonial-star-empty"
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="testimonial-rating-value">({testimonial.rating})</span>
                </div>
                <p className="testimonial-quote-premium">{testimonial.quote}</p>
                <p className="testimonial-author-premium">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

