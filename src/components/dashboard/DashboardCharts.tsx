"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

type ChartPoint = { name: string; value: number };

const CHART_COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#14B8A6"];

function getLast7Days(): ChartPoint[] {
  const out: ChartPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: 0,
    });
  }
  return out;
}

function normalizeSeries(raw: unknown[]): ChartPoint[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any) => {
    const name = item?.name ?? item?.label ?? item?.x ?? item?.date ?? String(item);
    const val = typeof item?.value === "number" ? item.value : Number(item?.count ?? item?.y ?? 0) || 0;
    return { name: String(name), value: val };
  });
}

export function DashboardCharts() {
  const [bookingsOverTime, setBookingsOverTime] = useState<ChartPoint[]>(getLast7Days());
  const [customersOverTime, setCustomersOverTime] = useState<ChartPoint[]>(getLast7Days());
  const [topServices, setTopServices] = useState<ChartPoint[]>([]);
  const [bookingsByStatus, setBookingsByStatus] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        // 1) Optional: pre-aggregated analytics from Firebase.
        //    Collection: "AnalyticsCollection". Each doc: { type: string, data: Array<{name/label/x, value/count/y}> }
        //    Supported type: "bookings_over_time" | "customers_over_time" | "top_services" | "bookings_by_status"
        let analytics: Record<string, ChartPoint[]> = {};
        try {
          const snap = await getDocs(collection(db, "AnalyticsCollection"));
          snap.docs.forEach((d) => {
            const t = (d.data()?.type || d.id) as string;
            const raw = d.data()?.data;
            if (Array.isArray(raw) && raw.length) analytics[t] = normalizeSeries(raw);
          });
        } catch {
          /* use derived data when AnalyticsCollection is missing or empty */
        }

        // 2) Apply from analytics or derive
        if (analytics.bookings_over_time?.length) {
          setBookingsOverTime(analytics.bookings_over_time);
        } else {
          const bookingsSnap = await getDocs(collection(db, "BookingServiceCollection"));
          const byDate: Record<string, number> = {};
          getLast7Days().forEach(({ name }) => (byDate[name] = 0));
          const today = new Date();
          bookingsSnap.docs.forEach((doc) => {
            const createdAt = doc.data()?.createdAt;
            const d = createdAt ? new Date(createdAt) : null;
            if (!d) return;
            const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const daysDiff = Math.floor((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
            if (daysDiff >= 0 && daysDiff <= 6 && byDate[key] !== undefined) byDate[key]++;
          });
          setBookingsOverTime(getLast7Days().map(({ name }) => ({ name, value: byDate[name] ?? 0 })));
        }

        if (analytics.customers_over_time?.length) {
          setCustomersOverTime(analytics.customers_over_time);
        } else {
          const usersSnap = await getDocs(collection(db, "UsersCollection"));
          const byDate: Record<string, number> = {};
          getLast7Days().forEach(({ name }) => (byDate[name] = 0));
          const today = new Date();
          usersSnap.docs.forEach((doc) => {
            const raw =
              doc.data()?.createdAt ??
              doc.data()?.created_at ??
              doc.data()?.registrationDate ??
              doc.data()?.signUpDate ??
              doc.data()?.joinedAt ??
              doc.data()?.dateCreated ??
              doc.data()?.timestamp;
            let d: Date | null = null;
            if (raw) {
              if (typeof raw?.toDate === "function") d = raw.toDate();
              else if (raw instanceof Date) d = raw;
              else if (typeof raw === "number") d = new Date(raw);
              else if (typeof raw === "string") d = new Date(raw);
            }
            if (!d || isNaN(d.getTime())) return;
            const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const daysDiff = Math.floor((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
            if (daysDiff >= 0 && daysDiff <= 6 && byDate[key] !== undefined) byDate[key]++;
          });
          setCustomersOverTime(getLast7Days().map(({ name }) => ({ name, value: byDate[name] ?? 0 })));
        }

        if (analytics.top_services?.length) {
          setTopServices(analytics.top_services);
        } else {
          const bookingsSnap = await getDocs(collection(db, "BookingServiceCollection"));
          const byService: Record<string, number> = {};
          bookingsSnap.docs.forEach((doc) => {
            const name = doc.data()?.serviceName ?? doc.data()?.categoryModel?.name ?? "Other";
            byService[name] = (byService[name] ?? 0) + 1;
          });
          setTopServices(
            Object.entries(byService)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 8)
          );
        }

        if (analytics.bookings_by_status?.length) {
          setBookingsByStatus(analytics.bookings_by_status);
        } else {
          const bookingsSnap = await getDocs(collection(db, "BookingServiceCollection"));
          const byStatus: Record<string, number> = {};
          bookingsSnap.docs.forEach((doc) => {
            const s = doc.data()?.status ?? "Unknown";
            byStatus[s] = (byStatus[s] ?? 0) + 1;
          });
          setBookingsByStatus(
            Object.entries(byStatus).map(([name, value]) => ({ name, value })).filter((a) => a.value > 0)
          );
        }
      } catch (e) {
        console.error("DashboardCharts fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 h-[320px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6">
      {/* Bookings over time - Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Bookings over time (last 7 days)</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingsOverTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9CA3AF" }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }}
                formatter={(v: number | undefined) => [v ?? 0, "Bookings"]}
                labelFormatter={(l) => `Date: ${l}`}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customers over time - Line */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">New customers (last 7 days)</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customersOverTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9CA3AF" }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }}
                formatter={(v: number | undefined) => [v ?? 0, "Customers"]}
              />
              <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} dot={{ fill: "#6366F1", r: 4 }} name="Customers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top services - Bar (horizontal feel via layout) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Top services by bookings</h3>
        <div className="h-[260px]">
          {topServices.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topServices} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#9CA3AF" }} stroke="#9CA3AF" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "#9CA3AF" }} stroke="#9CA3AF" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }} formatter={(v: number | undefined) => [v ?? 0, "Bookings"]} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">No booking data yet</div>
          )}
        </div>
      </div>

      {/* Bookings by status - Pie */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Bookings by status</h3>
        <div className="h-[260px]">
          {bookingsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {bookingsByStatus.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number | undefined) => [v ?? 0, "Count"]} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">No status data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
