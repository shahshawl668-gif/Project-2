"use client";

import type {
  Analytics,
  Application,
  ApplicationPayload,
  AuthResponse,
  MatchAnalysis,
} from "@/types/job-tracker";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      data?.detail || "Something went wrong while calling the API.",
      response.status,
    );
  }

  return data as T;
}

export async function registerUser(email: string, password: string) {
  return request<{ id: string; email: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchApplications(token: string) {
  return request<Application[]>("/applications", {}, token);
}

export async function createApplication(
  token: string,
  payload: ApplicationPayload,
) {
  return request<Application>(
    "/applications",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function updateApplication(
  token: string,
  id: string,
  payload: Partial<ApplicationPayload>,
) {
  return request<Application>(
    `/applications/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function deleteApplication(token: string, id: string) {
  return request<void>(
    `/applications/${id}`,
    {
      method: "DELETE",
    },
    token,
  );
}

export async function fetchAnalytics(token: string) {
  return request<Analytics>("/analytics", {}, token);
}

export async function analyzeResumeMatch(
  token: string,
  job_description: string,
  resume_text: string,
) {
  return request<MatchAnalysis>(
    "/ai/match",
    {
      method: "POST",
      body: JSON.stringify({ job_description, resume_text }),
    },
    token,
  );
}

export { ApiError };
