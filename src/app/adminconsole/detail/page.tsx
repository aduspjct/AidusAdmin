import React from "react";

export default function DetailScreen() {
  // This is a reusable detail view page
  // You can customize this based on your needs
  const detailData = {
    title: "Detail View",
    description: "This is a reusable detail screen component",
    fields: [
      { label: "Field 1", value: "Value 1" },
      { label: "Field 2", value: "Value 2" },
      { label: "Field 3", value: "Value 3" },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
          {detailData.title}
        </h1>
        <p className="mt-2 text-theme-sm text-gray-600 dark:text-gray-400">
          {detailData.description}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-theme-sm dark:bg-gray-800">
        <div className="space-y-4">
          {detailData.fields.map((field, index) => (
            <div key={index}>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {field.label}
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-white">
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
