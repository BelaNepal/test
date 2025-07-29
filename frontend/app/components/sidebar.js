"use client";

import Link from "next/link";
import { useLayout } from "@/context/LayoutContext";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { navbarHeight } = useLayout();
  const footerHeight = 50;

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Automatically collapse on tablet/mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`fixed left-0 bg-white border-r shadow-md z-40 overflow-auto transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{
        top: `${navbarHeight}px`,
        height: `calc(100vh - ${navbarHeight + footerHeight}px)`,
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
  );
}
