export interface KnowledgeBase {
  knowledge_base_id: string;
  name: string;
  description: string;
  connection_id: string;
  connection_source_ids: string[];
  indexing_params: {
    ocr: boolean;
    unstructured: boolean;
    embedding_params: {
      embedding_model: string;
      api_key: string | null;
    };
    chunker_params: {
      chunk_size: number;
      chunk_overlap: number;
      chunker: string;
    };
  };
}
