import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const CONFIG_ROW_ID = 1;

export type AppConfig = {
  id: number;
  is_configured: boolean;
  admin_username: string | null;
  admin_password_hash: string | null;
  visitor_code_hash: string | null;
};

export async function getAppConfig(): Promise<AppConfig | null> {
  const { data, error } = await supabaseAdmin
    .from("app_config")
    .select("*")
    .eq("id", CONFIG_ROW_ID)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load app config: ${error.message}`);
  }

  return data as AppConfig | null;
}

export async function isAppConfigured(): Promise<boolean> {
  const config = await getAppConfig();
  return Boolean(config?.is_configured);
}
