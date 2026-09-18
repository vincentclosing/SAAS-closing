"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin, ForbiddenError } from "@/lib/guards";
import { CONFIG_ROW_ID, getAppConfig } from "@/lib/config";

export type AdminActionState = { error: string | null; success?: boolean };

async function guardOrError(): Promise<string | null> {
  try {
    await requireAdmin();
    return null;
  } catch (e) {
    if (e instanceof ForbiddenError) return e.message;
    throw e;
  }
}

export async function updateVisitorCodeAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const guardError = await guardOrError();
  if (guardError) return { error: guardError };

  const code = String(formData.get("visitorCode") || "").trim();
  if (!code || code.length < 4) {
    return { error: "Le code visiteur doit contenir au moins 4 caractères." };
  }

  const visitor_code_hash = await bcrypt.hash(code, 10);
  const { error } = await supabaseAdmin
    .from("app_config")
    .update({ visitor_code_hash, updated_at: new Date().toISOString() })
    .eq("id", CONFIG_ROW_ID);

  if (error) return { error: `Erreur : ${error.message}` };

  revalidatePath("/admin");
  return { error: null, success: true };
}

export async function updateAdminPasswordAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const guardError = await guardOrError();
  if (guardError) return { error: guardError };

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");

  if (!newPassword || newPassword.length < 6) {
    return { error: "Le nouveau code doit contenir au moins 6 caractères." };
  }

  const config = await getAppConfig();
  if (!config?.admin_password_hash) {
    return { error: "Configuration introuvable." };
  }

  const valid = await bcrypt.compare(currentPassword, config.admin_password_hash);
  if (!valid) {
    return { error: "Code actuel incorrect." };
  }

  const admin_password_hash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabaseAdmin
    .from("app_config")
    .update({ admin_password_hash, updated_at: new Date().toISOString() })
    .eq("id", CONFIG_ROW_ID);

  if (error) return { error: `Erreur : ${error.message}` };

  revalidatePath("/admin");
  return { error: null, success: true };
}
