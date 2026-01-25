"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface BookingData {
  [key: string]: any;
}

export default function BookingDetail() {
  const params = useParams();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!db) {
        console.error("Firebase Firestore is not initialized");
        setError("Firebase is not initialized");
        setLoading(false);
        return;
      }

      try {
        const bookingDocRef = doc(db, "BookingServiceCollection", bookingId);
        const bookingDocSnap = await getDoc(bookingDocRef);

        if (bookingDocSnap.exists()) {
          const bookingData: BookingData = { id: bookingDocSnap.id, ...bookingDocSnap.data() };
          setBooking(bookingData);

          // Fetch customer data
          if (bookingData.customerId) {
            try {
              const customerDocRef = doc(db, "UsersCollection", bookingData.customerId);
              const customerDocSnap = await getDoc(customerDocRef);
              if (customerDocSnap.exists()) {
                setCustomer({ id: customerDocSnap.id, ...customerDocSnap.data() });
              }
            } catch (err) {
              console.error("Error fetching customer:", err);
            }
          }

          // Fetch provider data
          if (bookingData.assignedProviderId) {
            try {
              const providerDocRef = doc(db, "UsersCollection", bookingData.assignedProviderId);
              const providerDocSnap = await getDoc(providerDocRef);
              if (providerDocSnap.exists()) {
                setProvider({ id: providerDocSnap.id, ...providerDocSnap.data() });
              }
            } catch (err) {
              console.error("Error fetching provider:", err);
            }
          }
        } else {
          setError("Booking not found");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      if (typeof date === "string") {
        const d = new Date(date);
        return d.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      if (date.toDate) {
        // Firestore Timestamp
        return date.toDate().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return String(date);
    } catch {
      return String(date);
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : "None";
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  const getUserName = (user: any) => {
    if (!user) return "N/A";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.name || user.displayName || "N/A";
  };

  const getUserInitials = (user: any) => {
    if (!user) return "N/A";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes("pending") || statusLower === "customerpending") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
    if (statusLower.includes("confirmed") || statusLower.includes("accepted")) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
    if (statusLower.includes("complete") || statusLower.includes("done")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
    if (statusLower.includes("cancelled") || statusLower.includes("rejected")) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Booking Details
          </h1>
          <Link
            href="/adminconsole/bookings"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back to Bookings
          </Link>
        </div>
        <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Booking Details
          </h1>
          <Link
            href="/adminconsole/bookings"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back to Bookings
          </Link>
        </div>
        <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
          <p className="text-red-600 dark:text-red-400">{error || "Booking not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
          Booking Details
        </h1>
        <Link
          href="/adminconsole/bookings"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Back to Bookings
        </Link>
      </div>

      {/* Booking Information Section */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white lg:mb-6">
              Booking Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Booking ID
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white font-mono">
                  {booking.id || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Service Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {booking.serviceName || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}
                >
                  {booking.status || "N/A"}
                </span>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Estimated Service Price
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {booking.estimatedServicePrice ? `$${booking.estimatedServicePrice}` : "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Category
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {booking.categoryModel?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Agreement ID
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white font-mono text-xs break-all">
                  {booking.agreementId || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Created At
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {formatDate(booking.createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Completed At
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {formatDate(booking.completedAt)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Last Request Sent At
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {formatDate(booking.lastRequestSentAt)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Current Attempt
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {booking.currentAttempt ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer & Provider Information */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                Customer & Provider Information
              </h4>
              <Link
                href={`/adminconsole/chat?bookingId=${bookingId}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Open Customer & Provider Chat
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Customer
                </p>
                {customer ? (
                  <div className="flex items-center gap-3">
                    {customer.photo ? (
                      <img
                        src={customer.photo}
                        alt={getUserName(customer)}
                        className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-blue-500 ${
                        customer.photo ? "hidden" : "flex"
                      }`}
                    >
                      {getUserInitials(customer)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {getUserName(customer)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {booking.customerId?.substring(0, 20)}...
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-white font-mono text-xs break-all">
                    {booking.customerId || "N/A"}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Assigned Provider
                </p>
                {provider ? (
                  <div className="flex items-center gap-3">
                    {provider.photo ? (
                      <img
                        src={provider.photo}
                        alt={getUserName(provider)}
                        className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-green-500 ${
                        provider.photo ? "hidden" : "flex"
                      }`}
                    >
                      {getUserInitials(provider)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {getUserName(provider)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {booking.assignedProviderId?.substring(0, 20)}...
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-white font-mono text-xs break-all">
                    {booking.assignedProviderId || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      {booking.address && (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white lg:mb-6">
                Address
              </h4>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Address Type
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.address.addresstype || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Area
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.address.area || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Flat
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.address.flat || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Full Address
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.address.fullAddress || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Near
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.address.near || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Address ID
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white font-mono text-xs break-all">
                    {booking.address.id || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Latitude
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.address.latitude || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Longitude
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.address.longitude || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Audio Section */}
      {(booking.providerAudioUrl || booking.providerAudioDuration) && (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white lg:mb-6">
                Provider Audio
              </h4>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Audio Duration
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.providerAudioDuration || "N/A"}
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Audio URL
                  </p>
                  {booking.providerAudioUrl ? (
                    <audio controls className="w-full max-w-md">
                      <source src={booking.providerAudioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-white">N/A</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Section */}
      {(booking.rating !== undefined || booking.ratingDescription) && (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white lg:mb-6">
                Rating & Feedback
              </h4>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Rating
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.rating !== undefined ? `${booking.rating}/5` : "N/A"}
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Rating Description
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {booking.ratingDescription || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Before Photos Section */}
      {booking.beforePhotos && Array.isArray(booking.beforePhotos) && booking.beforePhotos.length > 0 && (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="w-full">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white lg:mb-6">
                Before Photos
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {booking.beforePhotos.map((photoUrl: string, index: number) => (
                  <div key={index} className="relative">
                    <a
                      href={photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={photoUrl}
                        alt={`Before photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* After Photos Section */}
      {booking.afterPhotos && Array.isArray(booking.afterPhotos) && booking.afterPhotos.length > 0 && (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="w-full">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white lg:mb-6">
                After Photos
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {booking.afterPhotos.map((photoUrl: string, index: number) => (
                  <div key={index} className="relative">
                    <a
                      href={photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={photoUrl}
                        alt={`After photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
