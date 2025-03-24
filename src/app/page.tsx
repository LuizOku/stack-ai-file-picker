"use client";

import { useEffect, useState } from "react";
import { useConnections } from "@/services/hooks/useConnections";
import { useAuth } from "@/stores/useAuth";
import { useLogin } from "@/services/hooks/useLogin";
import { useOrganizationId } from "@/services/hooks/useOrganizationId";
import { FilePicker } from "@/components/file-picker";

const EMAIL = process.env.NEXT_PUBLIC_STACK_AI_EMAIL as string;
const PASSWORD = process.env.NEXT_PUBLIC_STACK_AI_PASSWORD as string;
const MAX_AUTH_ATTEMPTS = 3;

export default function Home() {
  const { isAuthenticated, hydrated, setToken } = useAuth();
  const { login, error: loginError } = useLogin();
  const [authAttempts, setAuthAttempts] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shouldFetchConnections, setShouldFetchConnections] = useState(false);

  const { data: connections, error: connectionsError } = useConnections(
    shouldFetchConnections
  );
  const { error: organizationError } = useOrganizationId();

  // Handle authentication
  useEffect(() => {
    const authenticate = async () => {
      if (hydrated && !isAuthenticated && authAttempts < MAX_AUTH_ATTEMPTS) {
        try {
          setIsAuthenticating(true);
          console.log("Attempting login...");
          const token = await login({ email: EMAIL, password: PASSWORD });
          setToken(token);
          setShouldFetchConnections(true);
        } catch (error) {
          console.error("Authentication error:", error);
          setAuthAttempts((prev) => prev + 1);
        } finally {
          setIsAuthenticating(false);
          setIsInitialLoad(false);
        }
      } else if (hydrated && isAuthenticated) {
        // If already authenticated, ensure we fetch connections
        setShouldFetchConnections(true);
      }
    };

    authenticate();
  }, [hydrated, isAuthenticated, login, setToken, authAttempts]);

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      setShouldFetchConnections(false);
      setIsInitialLoad(true);
    };
  }, []);

  // Show loading state while store is hydrating
  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authenticating state while logging in
  if (!isAuthenticated || isAuthenticating) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {isInitialLoad
              ? "Loading..."
              : isAuthenticating
              ? "Authenticating..."
              : "Please wait..."}
          </p>
          {loginError && (
            <p className="text-red-600 text-sm mb-2">{loginError.message}</p>
          )}
          {authAttempts >= MAX_AUTH_ATTEMPTS && (
            <div className="mt-4">
              <p className="text-red-600 text-sm mb-2">
                Maximum authentication attempts reached. Please check your
                credentials and try again.
              </p>
              <button
                onClick={() => {
                  setAuthAttempts(0);
                  setIsInitialLoad(true);
                  setShouldFetchConnections(false);
                  window.location.reload();
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (connectionsError || organizationError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">
            {connectionsError instanceof Error
              ? connectionsError.message
              : organizationError instanceof Error
              ? organizationError.message
              : "Failed to load resources"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <FilePicker connections={connections || []} />
    </main>
  );
}
