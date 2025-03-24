import useSWRMutation from "swr/mutation";
import { API_URL, getAuthHeaders } from "@/services/api";
import { useAuth } from "@/stores/useAuth";

interface IndexPayload {
  connection_id: string;
  connection_source_ids: string[];
  org_id: string;
}

interface IndexResponse {
  success: boolean;
  message: string;
}

async function indexResourcesFn(url: string, { arg }: { arg: IndexPayload }) {
  const token = useAuth.getState().token;
  if (!token) {
    throw new Error("Authentication required");
  }

  const headers = {
    ...getAuthHeaders(token),
    "Content-Type": "application/json",
  };

  // Create or update KB with new resources
  const response = await fetch(`${API_URL}/knowledge_bases`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      connection_id: arg.connection_id,
      connection_source_ids: arg.connection_source_ids,
      name: "Meu File Picker KB",
      description: "Base única para indexação via File Picker",
      indexing_params: {
        ocr: false,
        unstructured: true,
        embedding_params: {
          embedding_model: "text-embedding-ada-002",
          api_key: null,
        },
        chunker_params: {
          chunk_size: 1500,
          chunk_overlap: 500,
          chunker: "sentence",
        },
      },
      org_level_role: null,
      cron_job_id: null,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update knowledge base");
  }

  // Trigger sync after creating/updating KB
  const kbId = process.env.NEXT_PUBLIC_KB_ID!;
  const syncResponse = await fetch(
    `${API_URL}/knowledge_bases/sync/trigger/${kbId}/${arg.org_id}`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  if (!syncResponse.ok) {
    throw new Error("Failed to sync knowledge base");
  }

  return syncResponse.json();
}

export function useIndexResources() {
  const { data, error, trigger, isMutating } = useSWRMutation<
    IndexResponse,
    Error,
    "/knowledge_bases",
    IndexPayload
  >("/knowledge_bases", indexResourcesFn);

  return {
    data,
    error,
    isLoading: isMutating,
    trigger,
  };
}
