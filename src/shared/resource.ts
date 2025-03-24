export interface Resource {
  knowledge_base_id: string;
  created_at: string;
  modified_at: string;
  indexed_at: string | null;
  inode_type: "file" | "directory";
  resource_id: string;
  inode_path: {
    path: string;
  };
  dataloader_metadata: {
    last_modified_at?: string;
    last_modified_by?: string | null;
    created_at?: string;
    created_by?: string;
    web_url?: string;
    path?: string;
  };
  user_metadata: Record<string, unknown>;
  inode_id: string | null;
  content_hash?: string;
  content_mime?: string;
  size?: number;
  status?: string;
}
