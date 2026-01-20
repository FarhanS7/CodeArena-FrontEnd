import { env } from "@/config/env";
import axios from "axios";

export const discussionClient = axios.create({
  baseURL: env.DISCUSSION_BASE_URL,
  withCredentials: true,
});

discussionClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Discussion Service Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
