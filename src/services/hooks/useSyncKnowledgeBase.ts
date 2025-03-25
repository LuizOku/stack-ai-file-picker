import useSWRMutation from "swr/mutation";
import { useAuth } from "@/stores/useAuth";
import { API_URL } from "@/services/api";

export function useSyncKnowledgeBase() {
  return useSWRMutation(
    "/knowledge_bases/sync/trigger",
    async (
      url,
      { arg }: { arg: { knowledge_base_id: string; org_id: string } }
    ) => {
      const token = useAuth.getState().token;
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}${url}/${arg.knowledge_base_id}/${arg.org_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
