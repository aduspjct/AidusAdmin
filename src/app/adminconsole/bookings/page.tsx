"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

interface Booking {
  id: string;
  serviceName?: string;
  customerId?: string;
  assignedProviderId?: string;
  status?: string;
  address?: {
    addresstype?: string;
    area?: string;
    flat?: string;
    fullAddress?: string;
    latitude?: string;
    longitude?: string;
    near?: string;
  };
  categoryModel?: {
    name?: string;
    image?: string;
  };
  estimatedServicePrice?: string;
  createdAt?: string;
  lastRequestSentAt?: any;
  [key: string]: any;
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    if (!db) {
      console.error("Firebase Firestore is not initialized");
      setError("Firebase is not initialized");
      setLoading(false);
      return;
    }

    try {
      const bookingsCollection = collection(db, "BookingServiceCollection");
      const bookingsSnapshot = await getDocs(bookingsCollection);

      const bookingsData: Booking[] = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt (newest first)
      bookingsData.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (bookingId: string) => {
    router.push(`/adminconsole/bookings/${bookingId}`);
  };

  const formatDate = (dateString: string | any) => {
    if (!dateString) return "N/A";
    try {
      if (typeof dateString === "string") {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      if (dateString.toDate) {
        // Firestore Timestamp
        return dateString.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return String(dateString);
    } catch {
      return String(dateString);
    }
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
    if (statusLower.includes("completed") || statusLower.includes("done")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
    if (statusLower.includes("cancelled") || statusLower.includes("rejected")) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getAddressDisplay = (address: Booking["address"]) => {
    if (!address) return "N/A";
    return address.area || address.fullAddress || address.flat || "N/A";
  };

  const filteredBookings = (() => {
    const q = String(filterQuery || "").trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        (b.serviceName || "").toLowerCase().includes(q) ||
        (b.categoryModel?.name || "").toLowerCase().includes(q) ||
        (b.status || "").toLowerCase().includes(q) ||
        (b.customerId || "").toLowerCase().includes(q) ||
        (b.assignedProviderId || "").toLowerCase().includes(q) ||
        (getAddressDisplay(b.address) || "").toLowerCase().includes(q) ||
        (b.estimatedServicePrice || "").toString().toLowerCase().includes(q)
    );
  })();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Booking Management
          </h1>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
          Booking Management
        </h1>
        <input
          type="search"
          placeholder="Search by service, status, customer, address…"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-64 md:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Provider ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {bookings.length === 0 ? "No bookings found" : "No bookings match your search"}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleRowClick(booking.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {booking.serviceName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {booking.categoryModel?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {booking.customerId ? booking.customerId.substring(0, 20) + "..." : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {booking.assignedProviderId ? booking.assignedProviderId.substring(0, 20) + "..." : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {getAddressDisplay(booking.address)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}
                      >
                        {booking.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {booking.estimatedServicePrice ? `$${booking.estimatedServicePrice}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/adminconsole/bookings/${booking.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
