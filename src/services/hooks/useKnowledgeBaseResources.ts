import useSWR from "swr";
import { useAuth } from "@/stores/useAuth";
import { API_URL } from "@/services/api";
import { Resource } from "@/shared/resource";

interface KnowledgeBaseResourcesResponse {
  data: Resource[];
  next_cursor: string;
  current_cursor: string | null;
}

export function useKnowledgeBaseResources(
  knowledgeBaseId?: string,
  resourcePath: string = "/"
) {
  const token = useAuth.getState().token;
  const params = new URLSearchParams();

  // Encode the path for URL safety
  params.set(
    "resource_path",
    resourcePath === "/" ? resourcePath : encodeURIComponent(resourcePath)
  );

  return useSWR<KnowledgeBaseResourcesResponse>(
    knowledgeBaseId
      ? `/knowledge_bases/${knowledgeBaseId}/resources/children${
          params.toString() ? `?${params.toString()}` : ""
        }`
      : null,
    async (url: string) => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        useAuth.getState().logout();
        throw new Error("Authentication expired");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    }
  );
}
