import { useAuth } from "@/stores/useAuth";

export interface ApiError {
  message: string;
  status: number;
}

export const BACKEND_URL = process.env.NEXT_PUBLIC_STACK_AI_API_URL as string;
export const SUPABASE_AUTH_URL = process.env
  .NEXT_PUBLIC_SUPABASE_AUTH_URL as string;
export const ANON_KEY = process.env.NEXT_PUBLIC_ANON_KEY as string;

if (!BACKEND_URL || !SUPABASE_AUTH_URL || !ANON_KEY) {
  throw new Error("Missing required environment variables");
}

export const API_URL = "https://api.stack-ai.com";

export function getAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const fetcher = async (url: string) => {
  const token = useAuth.getState().token;
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}${url}`, {
    headers: getAuthHeaders(token),
  });

  if (response.status === 401) {
    // If unauthorized, clear the token and throw error
    useAuth.getState().logout();
    throw new Error("Authentication expired");
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
