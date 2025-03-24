import useSWR from "swr";
import { fetcher } from "@/services/api";
import { Resource } from "@/shared/resource";

interface PaginatedResponse {
  data: Resource[];
  next_cursor: string;
  current_cursor: string | null;
}

export function useListResources(
  connectionId?: string,
  resourceId: string = "/"
) {
  const params = new URLSearchParams();

  if (resourceId !== "/") {
    params.set("resource_id", resourceId);
  }

  const { data, error } = useSWR<PaginatedResponse>(
    connectionId
      ? `/connections/${connectionId}/resources/children${
          params.toString() ? `?${params.toString()}` : ""
        }`
      : null,
    fetcher
  );

  return {
    data: data?.data,
    nextCursor: data?.next_cursor,
    currentCursor: data?.current_cursor,
    error,
    isLoading: !data && !error,
  };
}
