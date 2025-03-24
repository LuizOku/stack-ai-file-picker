import useSWR from "swr";
import { fetcher } from "../api";

export interface KnowledgeBaseResource {
  resource_id: string;
  inode_path: {
    path: string;
  };
  inode_type: "file" | "directory";
  name: string;
  status?: "indexed" | "pending" | "error";
  created_at: string;
  updated_at: string;
}

export function useKnowledgeBaseResources(resourcePath: string = "/") {
  const knowledge_base_id = process.env.NEXT_PUBLIC_KB_ID;

  const query = new URLSearchParams({
    resource_path: resourcePath,
  }).toString();

  const url = `/knowledge_bases/${knowledge_base_id}/resources/children?${query}`;

  return useSWR<KnowledgeBaseResource[]>(
    knowledge_base_id ? url : null,
    fetcher
  );
}
