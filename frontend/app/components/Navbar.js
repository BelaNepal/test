"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center transition-all duration-300`}
      style={{
        height: scrolled ? "50px" : "80px",
        padding: scrolled ? "0 20px" : "10px 40px",
      }}
    >
      {/* Title pinned to very left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center pl-4"
        style={{ fontSize: scrolled ? "1.2rem" : "1.8rem", zIndex: 60 }}
      >
        <span className="typing-text text-blue-700 font-bold whitespace-nowrap">
          Project - Bela IMS
        </span>
      </div>

      {/* Menu container fills full width but pushes content to right */}
      <div className="flex flex-1 justify-end items-center space-x-6 text-lg pr-4">
        <Link href="/" className="hover:text-blue-600 transition">
          Home
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {pathname !== "/login" && (
              <Link href="/login" className="hover:text-blue-600 transition">
                Login
              </Link>
            )}
            <Link href="/register" className="hover:text-blue-600 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
