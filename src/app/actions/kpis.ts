"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin, ForbiddenError } from "@/lib/guards";

export type KpisActionState = { error: string | null; success?: boolean };

function toNumber(formData: FormData, key: string): number {
  const raw = String(formData.get(key) || "0").replace(",", ".");
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

export async function updateKpisAction(
  _prevState: KpisActionState,
  formData: FormData
): Promise<KpisActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof ForbiddenError) return { error: e.message };
    throw e;
  }

  const calls_count = Math.max(0, Math.round(toNumber(formData, "calls_count")));
  const closing_rate = Math.min(100, Math.max(0, toNumber(formData, "closing_rate")));
  const show_up_rate = Math.min(100, Math.max(0, toNumber(formData, "show_up_rate")));
  const cash_contracted = Math.max(0, toNumber(formData, "cash_contracted"));
  const cash_collected = Math.max(0, toNumber(formData, "cash_collected"));

  const { error } = await supabaseAdmin
    .from("kpis")
    .update({
      calls_count,
      closing_rate,
      show_up_rate,
      cash_contracted,
      cash_collected,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    return { error: `Erreur lors de la mise à jour : ${error.message}` };
  }

  revalidatePath("/");
  return { error: null, success: true };
}
