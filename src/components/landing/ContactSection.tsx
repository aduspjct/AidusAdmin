"use client";

import React, { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateWrapperClick = () => {
    const dateInput = document.getElementById('date') as HTMLInputElement;
    if (dateInput) {
      if (typeof dateInput.showPicker === 'function') {
        dateInput.showPicker();
      } else {
        dateInput.focus();
      }
    }
  };

  return (
    <section id="book" className="section-gray contact-section-map">
      <div className="section-container">
        <div className="grid-responsive">
          {/* Left: Contact Info */}
          <div className="form-card contact-info-card">
            <h2 className="contact-heading">
              Send a message to get your free quote.
            </h2>

            {/* User Avatars */}
            <div className="contact-avatars">
              <div className="contact-avatar">
                <img
                  src="https://cdn-icons-png.freepik.com/512/145/145843.png"
                  alt="User 1"
                  className="contact-avatar-image"
                />
              </div>
              <div className="contact-avatar">
                <img
                  src="https://images.icon-icons.com/2643/PNG/512/female_woman_avatar_people_person_white_tone_icon_159370.png"
                  alt="User 2"
                  className="contact-avatar-image"
                />
              </div>
              <div className="contact-avatar">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7ANbbzo2DO6nrwR-xOvODW0PlIsjQjKqwmA&s"
                  alt="User 3"
                  className="contact-avatar-image"
                />
              </div>
              <div className="contact-avatar-count">10+</div>
            </div>

            {/* Contact Details */}
            <div className="contact-details-wrapper">
              <div className="contact-info-item">
                <img
                  src="/images/landing/icons/email.png"
                  alt="Email"
                  className="contact-info-icon"
                />
                <span className="contact-info-text">demo@gmail.com</span>
              </div>
              <div className="contact-info-item">
                <img
                  src="/images/landing/icons/phone.png"
                  alt="Phone"
                  className="contact-info-icon"
                />
                <span className="contact-info-text">808-555-0111</span>
              </div>
              <div className="contact-info-item">
                <img
                  src="/images/landing/icons/location.png"
                  alt="Location"
                  className="contact-info-icon"
                />
                <span className="contact-info-text">
                  2118 Thornridge Cir Syracuse Connecticut 35624
                </span>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="form-card">
            <h3 className="booking-form-title">Booking Form</h3>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="booking-form-grid">
                <div className="booking-form-field">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="booking-form-field">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="booking-form-field">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your contact number"
                    required
                  />
                </div>
                <div className="booking-form-field">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <div className="form-date-wrapper" onClick={handleDateWrapperClick}>
                    <input
                      type="date"

                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="form-input form-date-input"
                      placeholder="Select Date"
                      required
                    />
                    <svg className="form-date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="booking-form-field booking-form-field-full">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="form-input"
                  placeholder="Enter your address"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary booking-form-button"
              >
                Get a quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

