import useSWRMutation from "swr/mutation";
import { useAuth } from "@/stores/useAuth";
import { API_URL } from "@/services/api";

interface CreateKnowledgeBaseParams {
  connection_id: string;
  connection_source_ids: string[];
  name: string;
  description: string;
}

interface KnowledgeBaseResponse {
  knowledge_base_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function useCreateKnowledgeBase() {
  return useSWRMutation<
    KnowledgeBaseResponse,
    Error,
    string,
    CreateKnowledgeBaseParams
  >("/knowledge_bases", async (url, { arg }) => {
    const token = useAuth.getState().token;
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...arg,
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

    if (response.status === 401) {
      useAuth.getState().logout();
      throw new Error("Authentication expired");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  });
}
