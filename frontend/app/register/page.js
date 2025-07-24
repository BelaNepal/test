"use client";
import { useState } from "react";
import { api } from "../../utils/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className="mb-4 p-2 border border-gray-300 rounded w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        className="mb-4 p-2 border border-gray-300 rounded w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Register
      </button>
      {message && (
        <p
          className={`mt-4 ${
            message.toLowerCase().includes("success")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
