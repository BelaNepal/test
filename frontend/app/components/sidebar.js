"use client";

import Link from "next/link";
import { useLayout } from "@/context/LayoutContext";

export default function Sidebar() {
  const { navbarHeight } = useLayout();
  const footerHeight = 50; // updated footer height to 50px

  return (
    <aside
      className="w-64 fixed left-0 bg-white border-r shadow-md z-40 overflow-auto"
      style={{
        top: `${navbarHeight}px`,
        bottom: `${footerHeight}px`,
      }}
    >
      <div className="p-6 font-bold text-xl border-b">Your App</div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link href="/dashboard" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded">
          Dashboard
        </Link>
        <Link href="/dashboard/settings" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded">
          Settings
        </Link>
        <Link href="/dashboard/profile" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded">
          Profile
        </Link>
      </nav>
    </aside>
  );
}
