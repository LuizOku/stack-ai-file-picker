import { useState } from "react";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginError extends Error {
  message: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);

  const login = async ({
    email,
    password,
  }: LoginCredentials): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://sb.stack-ai.com/auth/v1/token?grant_type=password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZic3VhZGZxaGtseG9rbWxodHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM0NTg5ODAsImV4cCI6MTk4OTAzNDk4MH0.Xjry9m7oc42_MsLRc1bZhTTzip3srDjJ6fJMkwhXQ9s",
          },
          body: JSON.stringify({
            email,
            password,
            gotrue_meta_security: {},
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      return data.access_token;
    } catch (err) {
      const error = err as LoginError;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}
