export interface Connection {
  connection_id: string;
  name: string;
  connection_provider: string;
  connection_provider_data: {
    access_token: string;
    refresh_token: string;
    expiry: string;
    token_type: string;
  };
  created_at: string;
  updated_at: string;
}
