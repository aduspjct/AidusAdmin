"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

interface ServiceCategory {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  active?: boolean;
}

// Fallback emoji per common category names (used when no image)
const iconByTitle: Record<string, string> = {
  Gardener: "🌿",
  Electrician: "⚡",
  Painter: "🎨",
  Plumber: "🔧",
  Carpenter: "🪵",
  Cleaner: "🧹",
  "Car Wash": "🚗",
  "Pest Control": "🐛",
  HVAC: "❄️",
  "Pet Groomer": "🐕",
  Handyman: "🔨",
  Flooring: "🔲",
  "Sofa Cleaning": "🛋️",
  "Beauty/Salon": "💄",
  "Water Purifier": "💧",
};

// Fallback descriptions when Firebase document has no description
const descriptionByTitle: Record<string, string> = {
  Gardener: "Lawn care, plant maintenance, trimming, and garden clean up.",
  Electrician: "Wiring, fan & light installation, switchboard repair, and troubleshooting.",
  Painter: "Interior & exterior painting, wall finishing, and touch-up services.",
  Plumber: "Leak repair, pipe installation, drainage issues, and bathroom fittings.",
  Carpenter: "Furniture repair, custom woodwork, doors, shelves, and fittings.",
  Cleaner: "Home, office, deep cleaning, and sanitization services.",
  "Car Wash": "Exterior & interior car cleaning, polishing and detailing.",
  "Pest Control": "Termite, rodent, insect, and mosquito control treatments.",
  HVAC: "AC installation, servicing, repair, and maintenance.",
  "Pet Groomer": "Bathing, trimming, nail clipping, and full grooming for your pets.",
  Handyman: "Repairs, assembly, mounting, and general home maintenance tasks.",
  Flooring: "Tile, wood, laminate installation, repair, and polishing.",
  "Sofa Cleaning": "Deep cleaning, stain removal, and fabric care for sofas and upholstery.",
  "Beauty/Salon": "Hair styling, skincare, makeup, and salon services at home.",
  "Water Purifier": "Installation, repair, and maintenance of water purifiers and dispensers.",
};

const DEFAULT_DESCRIPTION = "Professional service at your doorstep.";

const DEFAULT_ICON = "🔧";

function getIconForCategory(category: ServiceCategory): string {
  const name = (category.name || category.title || "").trim();
  return iconByTitle[name] ?? DEFAULT_ICON;
}

function getDescriptionForCategory(category: ServiceCategory): string {
  if (category.description && category.description.trim()) {
    return category.description.trim();
  }
  const name = (category.name || category.title || "").trim();
  return descriptionByTitle[name] ?? DEFAULT_DESCRIPTION;
}

export default function ServicesSection() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      if (!db) {
        setError("Firebase is not initialized");
        setLoading(false);
        return;
      }

      try {
        const servicesRef = collection(db, "ServiceCollection");
        const snapshot = await getDocs(servicesRef);

        const all = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ServiceCategory[];

        const result = all
          .filter((s) => s.active !== false)
          .slice(0, 9);

        setCategories(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section id="services" className="section-white">
        <div className="section-container">
          <h2 className="heading-section">
            All Home
            <span className="text-blue"> Services </span>
            in One App
          </h2>
          <div className="grid-services">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="service-card animate-pulse">
                <div className="service-card-header">
                  <div className="service-avatar">
                    <span className="service-avatar-icon opacity-50">🔧</span>
                  </div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                </div>
                <div className="service-card-body">
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="section-white">
        <div className="section-container">
          <h2 className="heading-section">
            All Home
            <span className="text-blue"> Services </span>
            in One App
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section-white">
      <div className="section-container">
        <h2 className="heading-section">
          All Home
          <span className="text-blue"> Services </span>
          in One App
        </h2>

        <div className="grid-services">
          {categories.map((category) => {
            const title = category.name || category.title || "Service";
            const icon = getIconForCategory(category);
            return (
              <div key={category.id} className="service-card">
                <div className="service-card-header">
                  <div className="service-avatar">
                    {category.image ? (
                      <span className="service-avatar-icon flex items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={category.image}
                          alt=""
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      </span>
                    ) : (
                      <span className="service-avatar-icon">{icon}</span>
                    )}
                  </div>
                  <h3 className="service-title">{title}</h3>
                </div>
                <div className="service-card-body">
                  <p className="service-description">
                    {getDescriptionForCategory(category)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
