import { env } from "@/config/env";
import axios from "axios";

export const aiClient = axios.create({
  baseURL: env.AI_BASE_URL,
  withCredentials: true,
});

aiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("AI Service Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
