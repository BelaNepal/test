"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayout } from "@/context/LayoutContext";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

import {
  LayoutDashboard,
  FileText,
  FileStack,
  Settings,
  User,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/dashboard/customer-form", label: "Customer Form", icon: <FileText size={20} /> },
  { href: "/dashboard/documents", label: "Documents", icon: <FileStack size={20} /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
  { href: "/dashboard/profile", label: "Profile", icon: <User size={20} /> },
];

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Sidebar() {
  const {
    navbarHeight,
    collapsed,
    isMobile,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
  } = useLayout();

  const { username } = useUser();
  const pathname = usePathname();
  const footerHeight = 50; // height of footer in px

  // Debug: check username loaded from context
  useEffect(() => {
    console.log("Sidebar username from context:", username);
  }, [username]);

  // Mobile: close sidebar when clicking outside
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;

    function handleClickOutside(e) {
      // You might want to refine this with ref check, simplified here
      setMobileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, mobileOpen, setMobileOpen]);

  if (isMobile) {
    return (
      <nav
        className="fixed left-0 right-0 z-50 bg-white border-t shadow-md flex justify-around py-2"
        style={{ bottom: `${footerHeight}px` }}
      >
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-xs font-medium px-2 py-1 rounded
                ${
                  active
                    ? "text-[#1e2d4d] bg-[#e4eaf5]"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }
                transition-colors
              `}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={`fixed bg-white border-r shadow-md z-30 overflow-y-auto transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}`}
      style={{
        top: `${navbarHeight}px`,
        height: `calc(100vh - ${navbarHeight + footerHeight}px)`,
        left: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b">
        {!collapsed && (
          <div className="font-semibold text-base text-[#1e2d4d] truncate max-w-[70%]">
            Welcome <strong>{capitalizeFirstLetter(username) || "Guest"}</strong>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title="Toggle Sidebar"
          className="p-2 rounded-full bg-gray-100 hover:bg-[#ef7e1e] hover:text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ef7e1e] flex items-center justify-center"
          aria-pressed={collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          )}
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
                ${
                  active
                    ? "bg-[#e4eaf5] text-[#1e2d4d] border-l-4 border-[#ef7e1e] shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }
                ${collapsed ? "justify-center" : "gap-3"}`}
              style={{
                transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s",
              }}
              aria-current={active ? "page" : undefined}
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
