"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

// Inline icons for Banner and Service
const BannerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ServiceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

export const DashboardMetrics = () => {
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [bannerCount, setBannerCount] = useState<number>(0);
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [customerChange, setCustomerChange] = useState<number>(0);
  const [bookingChange, setBookingChange] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!db) {
        console.error("Firebase Firestore is not initialized");
        setLoading(false);
        return;
      }

      try {
        // Calculate date range: last 7 days
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);
        
        // Calculate previous 7 days period (8-14 days ago) for percentage comparison
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgoTimestamp = Timestamp.fromDate(fourteenDaysAgo);

        // Fetch customers from last 7 days
        const customersQuery = query(
          collection(db, "UsersCollection"),
          where("createdAt", ">=", sevenDaysAgoTimestamp)
        );
        
        // Fetch bookings from last 7 days
        const bookingsQuery = query(
          collection(db, "BookingServiceCollection"),
          where("createdAt", ">=", sevenDaysAgoTimestamp)
        );
        
        // Fetch previous period customers (8-14 days ago) for comparison
        const previousCustomersQuery = query(
          collection(db, "UsersCollection"),
          where("createdAt", ">=", fourteenDaysAgoTimestamp),
          where("createdAt", "<", sevenDaysAgoTimestamp)
        );
        
        // Fetch previous period bookings (8-14 days ago) for comparison
        const previousBookingsQuery = query(
          collection(db, "BookingServiceCollection"),
          where("createdAt", ">=", fourteenDaysAgoTimestamp),
          where("createdAt", "<", sevenDaysAgoTimestamp)
        );

        const [
          customersSnap,
          bookingsSnap,
          bannersSnap,
          servicesSnap,
          previousCustomersSnap,
          previousBookingsSnap
        ] = await Promise.all([
          getDocs(customersQuery),
          getDocs(bookingsQuery),
          getDocs(collection(db, "BannerCollection")),
          getDocs(collection(db, "ServiceCollection")),
          getDocs(previousCustomersQuery),
          getDocs(previousBookingsQuery),
        ]);

        const currentCustomerCount = customersSnap.size;
        const currentBookingCount = bookingsSnap.size;
        const previousCustomerCount = previousCustomersSnap.size;
        const previousBookingCount = previousBookingsSnap.size;

        setCustomerCount(currentCustomerCount);
        setBookingCount(currentBookingCount);
        setBannerCount(bannersSnap.size);
        setServiceCount(servicesSnap.size);

        // Calculate percentage changes
        const customerChange = previousCustomerCount > 0
          ? ((currentCustomerCount - previousCustomerCount) / previousCustomerCount) * 100
          : currentCustomerCount > 0 ? 100 : 0;
        
        const bookingChange = previousBookingCount > 0
          ? ((currentBookingCount - previousBookingCount) / previousBookingCount) * 100
          : currentBookingCount > 0 ? 100 : 0;

        // Store changes in state (we'll use these in the render)
        setCustomerChange(customerChange);
        setBookingChange(bookingChange);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setCustomerCount(0);
        setBookingCount(0);
        setBannerCount(0);
        setServiceCount(0);
        setCustomerChange(0);
        setBookingChange(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Percentage change for banners and services (not time-based)
  const bannerChange = 0;
  const serviceChange = 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-5"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
          <GroupIcon className="text-gray-800 size-6 dark:text-gray-200" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">
              {formatNumber(customerCount)}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {Math.abs(customerChange).toFixed(2)}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
          <BoxIconLine className="text-gray-800 dark:text-gray-200" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Bookings
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">
              {formatNumber(bookingCount)}
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            {Math.abs(bookingChange).toFixed(2)}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Banner Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
          <BannerIcon className="text-gray-800 size-6 dark:text-gray-200" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Banners</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">
              {formatNumber(bannerCount)}
            </h4>
          </div>
          {bannerChange !== 0 ? (
            <Badge color={bannerChange > 0 ? "success" : "error"}>
              {bannerChange > 0 ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
              {Math.abs(bannerChange).toFixed(2)}%
            </Badge>
          ) : (
            <Badge color="light">{bannerChange.toFixed(2)}%</Badge>
          )}
        </div>
      </div>

      {/* <!-- Service Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-700">
          <ServiceIcon className="text-gray-800 size-6 dark:text-gray-200" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Services</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">
              {formatNumber(serviceCount)}
            </h4>
          </div>
          {serviceChange !== 0 ? (
            <Badge color={serviceChange > 0 ? "success" : "error"}>
              {serviceChange > 0 ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
              {Math.abs(serviceChange).toFixed(2)}%
            </Badge>
          ) : (
            <Badge color="light">{serviceChange.toFixed(2)}%</Badge>
          )}
        </div>
      </div>
    </div>
  );
};
