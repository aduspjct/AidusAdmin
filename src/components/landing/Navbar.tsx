"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="section-container">
          <div className="navbar-container">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <Image
                  src="/images/landing/logo/logo_with_text.png"
                  width={516}
                  height={131}
                  className="h-10 w-auto"
                  alt="AIDUS Logo"
                  quality={100}
                  priority
                  unoptimized
                />
              </div>

              {/* Desktop Menu - Centered */}
              <div className="hidden min-[950px]:flex min-[950px]:items-center min-[950px]:space-x-8 flex-1 justify-center">
                <a href="#about" className="navbar-link">About</a>
                <a href="#services" className="navbar-link">Services</a>
                <a href="#why-us" className="navbar-link">Why Us</a>
                <a href="#testimonials" className="navbar-link">Testimonials</a>
                <a href="#book" className="navbar-link">Book Service</a>
              </div>

              {/* Download App Button */}
              <div className="hidden min-[950px]:block">
                <button className="btn-primary px-6 py-2.5 rounded-2xl font-semibold shadow-sm">
                  Download App
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="mobile-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer Backdrop */}
      {isMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMenuOpen ? "mobile-drawer-open" : ""}`}>
        <div className="mobile-drawer-header">
          <Image
            src="/images/landing/logo/logo_with_text.png"
            width={516}
            height={131}
            className="h-8 w-auto"
            alt="AIDUS Logo"
            quality={100}
            unoptimized
          />
          <button
            className="mobile-drawer-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mobile-drawer-content">
          <a href="#about" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#services" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#why-us" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Why Us</a>
          <a href="#testimonials" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
          <a href="#book" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Book Service</a>
          <button className="mobile-drawer-button btn-primary px-6 py-2.5 rounded-2xl font-semibold shadow-sm">
            Download App
          </button>
        </div>
      </div>
    </>
  );
}

