import React from "react";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <DashboardMetrics />
        <DashboardCharts />
      </div>
    </div>
  );
}
