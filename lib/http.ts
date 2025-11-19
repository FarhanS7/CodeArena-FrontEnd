// src/lib/http.ts
import { env } from "@/config/env";
import axios from "axios";

export const authClient = axios.create({
  baseURL: env.AUTH_BASE_URL,
  withCredentials: true, // <-- includes cookies automatically
});

// Optional: simple response/error logging for development
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You could add centralized error handling/logging here
    return Promise.reject(error);
  }
);
