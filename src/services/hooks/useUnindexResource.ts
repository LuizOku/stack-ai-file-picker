import { useAuth } from "@/stores/useAuth";
import { API_URL } from "@/services/api";

export function useUnindexResource() {
  const token = useAuth.getState().token;

  const unindexResource = async (
    knowledgeBaseId: string,
    resourcePath: string
  ) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    const params = new URLSearchParams();
    params.set(
      "resource_path",
      resourcePath === "/" ? resourcePath : encodeURIComponent(resourcePath)
    );

    const response = await fetch(
      `${API_URL}/knowledge_bases/${knowledgeBaseId}/resources?${params.toString()}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resource_path: resourcePath }),
      }
    );

    if (response.status === 401) {
      useAuth.getState().logout();
      throw new Error("Authentication expired");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  return { unindexResource };
}
