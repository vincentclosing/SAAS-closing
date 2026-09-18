import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { CallEntry } from "@/app/actions/calls";

export type Kpis = {
  calls_count: number;
  closing_rate: number;
  show_up_rate: number;
  cash_contracted: number;
  cash_collected: number;
};

export async function getKpis(): Promise<Kpis> {
  const { data, error } = await supabaseAdmin
    .from("kpis")
    .select("calls_count, closing_rate, show_up_rate, cash_contracted, cash_collected")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(`Impossible de charger les KPIs : ${error.message}`);

  return (
    data ?? {
      calls_count: 0,
      closing_rate: 0,
      show_up_rate: 0,
      cash_contracted: 0,
      cash_collected: 0,
    }
  );
}

export async function getCalls(): Promise<CallEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("calls")
    .select("*")
    .order("call_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Impossible de charger les calls : ${error.message}`);

  return data ?? [];
}
