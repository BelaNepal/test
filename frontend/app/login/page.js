"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../utils/api";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      if (!err.response) {
        setMessage("Cannot connect to server. Please try again later.");
      } else {
        setMessage(err.response.data?.error || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <p className="flex items-center text-red-600 gap-2 text-4xl font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          You are already logged in. Click below to go to Dashboard
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-10 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        value={form.username}
        autoFocus
        className="mb-4 p-2 border border-gray-300 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        value={form.password}
        className="mb-4 p-2 border border-gray-300 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`bg-blue-600 text-white px-6 py-2 rounded transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <p
          className={`mt-4 ${
            message.includes("successful") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
