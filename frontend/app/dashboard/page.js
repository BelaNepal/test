"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../utils/api";
import { useUser } from "@/context/UserContext"; // Add this import

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { setUsername: setGlobalUsername } = useUser(); // Get context setter

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessage(res.data.message);
        setUsername(res.data.user);
        setGlobalUsername(res.data.user); // <-- Update context
        localStorage.setItem("username", res.data.user); // <-- Update localStorage
      })
      .catch((err) => {
        console.error("Error fetching protected data", err);
        router.push("/login");
      });
  }, [router, setGlobalUsername]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");  // Redirect to homepage on logout
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Dashboard</h1>
        <h2 className="text-xl mb-4 text-gray-700">{message}</h2>
        <p className="mb-8 text-gray-600">
          Hello <strong className="font-semibold">{username}</strong>, you are logged in.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
