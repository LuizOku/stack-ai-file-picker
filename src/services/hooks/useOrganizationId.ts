import useSWR from "swr";
import { fetcher } from "../api";
import { useAuth } from "@/stores/useAuth";
import { useApp } from "@/stores/useApp";
import { useEffect } from "react";

interface Organization {
  org_id: string;
  created_at: string;
  org_name: string;
  org_plan: string;
  public_key: string;
  private_key: string;
  stripe_customer_id: string | null;
  client_reference_id: string | null;
  rate_limit: number;
  runs: number;
  runs_date: string;
  runs_day: string;
  runs_per_day: number;
  knowledge_base_max_files_to_sync: number | null;
  seats_limit: number | null;
  daily_token_limit: number;
  daily_token_date: string;
  daily_token_usage: number;
  trial_ends: string | null;
}

export function useOrganizationId() {
  const token = useAuth.getState().token;
  const setOrganizationId = useApp((state) => state.setOrganizationId);

  const { data, error } = useSWR<Organization>(
    token ? "/organizations/me/current" : null,
    fetcher
  );

  useEffect(() => {
    if (data?.org_id) {
      setOrganizationId(data.org_id);
    }
  }, [data, setOrganizationId]);

  return {
    data,
    error,
    isLoading: !data && !error,
  };
}
