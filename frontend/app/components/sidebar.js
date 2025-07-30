"use client";

import Link from "next/link";
import { useLayout } from "@/context/LayoutContext";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Sidebar config
const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  { href: "/dashboard/customer-form", label: "Customer Form", icon: "📝" },
];

export default function Sidebar() {
  const { navbarHeight } = useLayout();
  const footerHeight = 50;
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
      if (!mobile) setMobileOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, mobileOpen]);

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-3 left-3 z-50 p-2 bg-white rounded shadow-md text-lg"
        >
          ☰
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
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
        {/* Top section */}
        <div className="flex items-center justify-between px-3 py-3 border-b">
          {!collapsed && <div className="font-semibold text-base text-blue-700">Your App</div>}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 hover:text-blue-600 transition"
              title="Toggle Sidebar"
            >
              {collapsed ? "➤" : "⬅"}
            </button>
          )}
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
                  ${active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}
                  ${collapsed ? "justify-center" : "gap-3"}
                `}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
