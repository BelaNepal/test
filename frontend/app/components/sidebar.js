"use client";

import Link from "next/link";
import { useLayout } from "@/context/LayoutContext";
import { useState } from "react";

export default function Sidebar() {
  const { navbarHeight } = useLayout();
  const footerHeight = 50;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 bg-white border-r shadow-md z-40 overflow-auto transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{
        top: `${navbarHeight}px`,
        bottom: `${footerHeight}px`,
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {!collapsed && <div className="font-bold text-xl">Your App</div>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-900"
          title="Toggle Sidebar"
        >
          {collapsed ? "➤" : "⬅"}
        </button>
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

        {/* ✅ New "Customer Form" menu item */}
        <Link
          href="/dashboard/customer-form"
          className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
        >
          <span>📝</span>
          {!collapsed && <span>Customer Form1</span>}
        </Link>
      </nav>
    </aside>
  );
}
