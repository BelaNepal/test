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

  // Hide entire Navbar if logged in on login/register
  if (
    isLoggedIn &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300 flex items-center`}
      style={{
        height: scrolled ? "50px" : "80px",
        padding: scrolled ? "0 20px" : "10px 40px",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <div
          className="font-bold text-blue-700 transition-all duration-300"
          style={{ fontSize: scrolled ? "1.2rem" : "1.8rem" }}
        >
          LoginApp
        </div>
        <div className="space-x-6 text-lg flex items-center">
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
              {/* Hide Login link if user is on /login */}
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
      </div>
    </nav>
  );
}
