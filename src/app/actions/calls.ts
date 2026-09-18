"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin, ForbiddenError } from "@/lib/guards";

export type CallsActionState = { error: string | null; success?: boolean };

export type CallType = "client" | "roleplay";

export type CallEntry = {
  id: string;
  title: string;
  call_date: string;
  call_type: CallType;
  recording_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

async function guardOrError(): Promise<string | null> {
  try {
    await requireAdmin();
    return null;
  } catch (e) {
    if (e instanceof ForbiddenError) return e.message;
    throw e;
  }
}

function parseCallForm(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const call_date = String(formData.get("call_date") || "").trim();
  const call_type = String(formData.get("call_type") || "client").trim();
  const recording_url = String(formData.get("recording_url") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  return {
    title,
    call_date,
    call_type: call_type === "roleplay" ? "roleplay" : "client",
    recording_url: recording_url || null,
    notes: notes || null,
  };
}

export async function createCallAction(
  _prevState: CallsActionState,
  formData: FormData
): Promise<CallsActionState> {
  const guardError = await guardOrError();
  if (guardError) return { error: guardError };

  const values = parseCallForm(formData);
  if (!values.title) return { error: "Le titre est requis." };
  if (!values.call_date) return { error: "La date est requise." };

  const { error } = await supabaseAdmin.from("calls").insert(values);
  if (error) return { error: `Erreur lors de l'ajout : ${error.message}` };

  revalidatePath("/calls");
  return { error: null, success: true };
}

export async function updateCallAction(
  _prevState: CallsActionState,
  formData: FormData
): Promise<CallsActionState> {
  const guardError = await guardOrError();
  if (guardError) return { error: guardError };

  const id = String(formData.get("id") || "");
  if (!id) return { error: "Entrée introuvable." };

  const values = parseCallForm(formData);
  if (!values.title) return { error: "Le titre est requis." };
  if (!values.call_date) return { error: "La date est requise." };

  const { error } = await supabaseAdmin
    .from("calls")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: `Erreur lors de la mise à jour : ${error.message}` };

  revalidatePath("/calls");
  return { error: null, success: true };
}

export async function deleteCallAction(id: string): Promise<{ error: string | null }> {
  const guardError = await guardOrError();
  if (guardError) return { error: guardError };

  const { error } = await supabaseAdmin.from("calls").delete().eq("id", id);
  if (error) return { error: `Erreur lors de la suppression : ${error.message}` };

  revalidatePath("/calls");
  return { error: null };
}
