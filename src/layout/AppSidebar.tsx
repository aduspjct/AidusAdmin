"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const pathname = usePathname();
  const sidebarWidth = isExpanded || isHovered ? "w-[290px]" : "w-[90px]";
  const isVisible = isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0";

  const navItems: NavItem[] = [
    {
      href: "/adminconsole",
      label: "Dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/adminconsole/users",
      label: "User Management",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      href: "/adminconsole/categories",
      label: "Service Management",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      href: "/adminconsole/banners",
      label: "Banner Management",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: "/adminconsole/bookings",
      label: "Booking Management",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: "/adminconsole/chat",
      label: "User Chat",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === "/adminconsole") {
      return pathname === "/adminconsole";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-9999 h-screen ${sidebarWidth} bg-white shadow-theme-lg transition-all duration-300 dark:bg-gray-800 lg:translate-x-0 ${isVisible}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-full flex-col">
          {/* Header: logo + brand name (menu toggle removed; use header toggle) */}
          <div className="flex h-16 items-center px-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex min-w-0 flex-1 items-center gap-3 ${!(isExpanded || isHovered) ? "justify-center" : "justify-start"}`}>
              <img
                src="/images/landing/logo/logo.png"
                alt="Aidus"
                width={32}
                height={32}
                className="h-8 w-8 flex-shrink-0 object-contain"
              />
              {(isExpanded || isHovered) && (
                <h1 className="truncate text-lg font-bold text-gray-800 dark:text-white">
                  Aidus
                </h1>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {(isExpanded || isHovered) && (
              <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                MENU
              </p>
            )}
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`menu-item ${isActive(item.href) ? "menu-item-active" : "menu-item-inactive"} ${!(isExpanded || isHovered) ? "justify-center" : ""}`}
                  >
                    <span className={isActive(item.href) ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                      {item.icon}
                    </span>
                    {(isExpanded || isHovered) && (
                      <span className="menu-item-text">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

