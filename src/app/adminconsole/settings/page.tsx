import React from "react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-theme-sm text-gray-600 dark:text-gray-400">
          Manage your application settings and preferences.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-theme-sm dark:bg-gray-800">
        <div className="space-y-6">
          <div>
            <h2 className="text-theme-xl font-semibold text-gray-800 dark:text-white mb-4">
              General Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter site name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter site description"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-theme-xl font-semibold text-gray-800 dark:text-white mb-4">
              Notification Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive email notifications for important updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Push Notifications
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive push notifications in your browser
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
