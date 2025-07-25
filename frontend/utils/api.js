import axios from "axios";

const api = axios.create({
  baseURL: "https://bela-test.onrender.com/api",
});

// Add a request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
