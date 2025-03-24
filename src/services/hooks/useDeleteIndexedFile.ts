import useSWRMutation from "swr/mutation";
import { API_URL, getAuthHeaders } from "@/services/api";
import { useAuth } from "@/stores/useAuth";

interface DeletePayload {
  resource_path: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

async function deleteIndexedFileFn(
  url: string,
  { arg }: { arg: DeletePayload }
) {
  const token = useAuth.getState().token;
  if (!token) {
    throw new Error("Authentication required");
  }

  const kbId = process.env.NEXT_PUBLIC_KB_ID!;
  const query = new URLSearchParams({
    resource_path: arg.resource_path,
  }).toString();

  const response = await fetch(
    `${API_URL}/knowledge_bases/${kbId}/resources?${query}`,
    {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete indexed file");
  }

  return response.json();
}

export function useDeleteIndexedFile() {
  const { data, error, trigger, isMutating } = useSWRMutation<
    DeleteResponse,
    Error,
    "/knowledge_bases/resources",
    DeletePayload
  >("/knowledge_bases/resources", deleteIndexedFileFn);

  return {
    data,
    error,
    isLoading: isMutating,
    trigger,
  };
}
