"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayout } from "@/context/LayoutContext";
import { useEffect } from "react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  { href: "/dashboard/customer-form", label: "Customer Form", icon: "📝" },
];

export default function Sidebar() {
  const {
    navbarHeight,
    collapsed,
    isMobile,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
  } = useLayout();
  const pathname = usePathname();
  const footerHeight = 50;

  // For mobile outside click closing
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const handleClickOutside = (e) => {
      setMobileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, mobileOpen]);

  if (isMobile) {
    // MOBILE: bottom navbar
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-around py-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-xs font-medium px-2 py-1 ${
                active ? "text-[#1e2d4d]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // DESKTOP: sidebar
  return (
    <aside
      className={`fixed bg-white border-r shadow-md z-40 overflow-y-auto transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
      `}
      style={{
        top: `${navbarHeight}px`,
        height: `calc(100vh - ${navbarHeight + footerHeight}px)`,
        left: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b">
        {!collapsed && (
          <div className="font-semibold text-base text-[#1e2d4d]">Bela IMS</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-[#1e2d4d] transition"
          title="Toggle Sidebar"
        >
          {collapsed ? "➤" : "⬅"}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col py-2 space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center text-sm font-medium transition-all px-3 py-2 rounded-md
                ${active ? "bg-blue-100 text-[#1e2d4d]" : "text-gray-700 hover:bg-gray-100"}
                ${collapsed ? "justify-center" : "gap-3"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
