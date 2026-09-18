"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { getAppConfig, CONFIG_ROW_ID } from "@/lib/config";

export type ActionState = { error: string | null };

export async function setupAdminAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const visitorCode = String(formData.get("visitorCode") || "").trim();

  if (!username || username.length < 3) {
    return { error: "Le nom d'utilisateur doit contenir au moins 3 caractères." };
  }
  if (!password || password.length < 6) {
    return { error: "Le code admin doit contenir au moins 6 caractères." };
  }
  if (!visitorCode || visitorCode.length < 4) {
    return { error: "Le code visiteur doit contenir au moins 4 caractères." };
  }

  const existing = await getAppConfig();
  if (existing?.is_configured) {
    return { error: "L'application est déjà configurée." };
  }

  const admin_password_hash = await bcrypt.hash(password, 10);
  const visitor_code_hash = await bcrypt.hash(visitorCode, 10);

  const { error } = await supabaseAdmin
    .from("app_config")
    .update({
      is_configured: true,
      admin_username: username,
      admin_password_hash,
      visitor_code_hash,
      updated_at: new Date().toISOString(),
    })
    .eq("id", CONFIG_ROW_ID);

  if (error) {
    return { error: `Erreur lors de la configuration : ${error.message}` };
  }

  await setSessionCookie({ role: "admin", username });
  redirect("/");
}

export async function loginAdminAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Identifiants requis." };
  }

  const config = await getAppConfig();
  if (
    !config?.is_configured ||
    !config.admin_username ||
    !config.admin_password_hash
  ) {
    return { error: "L'application n'est pas encore configurée." };
  }

  if (config.admin_username !== username) {
    return { error: "Identifiants incorrects." };
  }

  const valid = await bcrypt.compare(password, config.admin_password_hash);
  if (!valid) {
    return { error: "Identifiants incorrects." };
  }

  await setSessionCookie({ role: "admin", username });
  redirect("/");
}

export async function loginVisitorAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const code = String(formData.get("code") || "").trim();

  if (!code) {
    return { error: "Code requis." };
  }

  const config = await getAppConfig();
  if (!config?.is_configured || !config.visitor_code_hash) {
    return { error: "L'application n'est pas encore configurée." };
  }

  const valid = await bcrypt.compare(code, config.visitor_code_hash);
  if (!valid) {
    return { error: "Code incorrect." };
  }

  await setSessionCookie({ role: "visitor" });
  redirect("/");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
