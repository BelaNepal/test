"use client";

import Link from "next/link";
import { useLayout } from "@/context/LayoutContext";
import { useState, useEffect, useRef } from "react";

export default function Sidebar() {
  const { navbarHeight } = useLayout();
  const footerHeight = 50;

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarRef = useRef(null);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
      if (!mobile) setMobileOpen(false); // Close mobile sidebar when switching to desktop
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on outside click (mobile only)
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;

    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, mobileOpen]);

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-2 left-2 z-50 p-2 bg-white rounded shadow-md"
        >
          ☰
        </button>
      )}

      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed bg-white border-r shadow-md z-40 overflow-auto transition-all duration-300 ease-in-out
          ${isMobile ? (mobileOpen ? "w-64" : "w-0") : collapsed ? "w-16" : "w-64"}
        `}
        style={{
          top: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight + footerHeight}px)`,
          left: 0,
        }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {!collapsed && <div className="font-bold text-xl">Your App</div>}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 hover:text-gray-900 ml-auto"
              title="Toggle Sidebar"
            >
              {collapsed ? "➤" : "⬅"}
            </button>
          )}
        </div>

        <nav className="flex flex-col p-2 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
          >
            <span>📊</span>
            {!collapsed && <span>Dashboard</span>}
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
          >
            <span>⚙️</span>
            {!collapsed && <span>Settings</span>}
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
          >
            <span>👤</span>
            {!collapsed && <span>Profile</span>}
          </Link>

          <Link
            href="/dashboard/customer-form"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
          >
            <span>📝</span>
            {!collapsed && <span>Customer Form</span>}
          </Link>
        </nav>
      </aside>
    </>
  );
}
