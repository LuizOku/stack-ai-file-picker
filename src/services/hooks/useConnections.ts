// hooks/useConnections.ts
import useSWR from "swr";
import { fetcher } from "@/services/api";
import { Connection } from "@/shared/connection";

export function useConnections(shouldFetch: boolean = true) {
  const { data, error } = useSWR<Connection[]>(
    shouldFetch ? `/connections` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading: !data && !error,
  };
}
