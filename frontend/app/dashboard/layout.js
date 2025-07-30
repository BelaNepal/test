"use client";

import { LayoutProvider, useLayout } from "@/context/LayoutContext";
import Sidebar from "@/components/sidebar";

function InnerLayout({ children }) {
  const { collapsed, isMobile, mobileOpen } = useLayout();
  const sidebarWidth = isMobile ? 0 : collapsed ? 64 : 256;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main
        className="flex-1 p-4 sm:p-6 pt-[80px] pb-[64px] transition-all"
        style={{ marginLeft: isMobile ? 0 : `${sidebarWidth}px` }}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <LayoutProvider>
      <InnerLayout>{children}</InnerLayout>
    </LayoutProvider>
  );
}
