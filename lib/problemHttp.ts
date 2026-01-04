// src/lib/problemHttp.ts
import { env } from "@/config/env";
import axios from "axios";

export const problemClient = axios.create({
  baseURL: env.PROBLEM_BASE_URL,
});
