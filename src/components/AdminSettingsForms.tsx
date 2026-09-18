"use client";

import { useActionState } from "react";
import {
  updateVisitorCodeAction,
  updateAdminPasswordAction,
  type AdminActionState,
} from "@/app/actions/admin";

const initialState: AdminActionState = { error: null };

export function VisitorCodeForm() {
  const [state, formAction, pending] = useActionState(
    updateVisitorCodeAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Nouveau code visiteur
        </span>
        <input
          name="visitorCode"
          type="text"
          required
          minLength={4}
          placeholder="Code partagé aux infopreneurs"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-400">Code visiteur mis à jour.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : "Mettre à jour le code"}
      </button>
    </form>
  );
}

export function AdminPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updateAdminPasswordAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Code admin actuel
        </span>
        <input
          name="currentPassword"
          type="password"
          required
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Nouveau code admin
        </span>
        <input
          name="newPassword"
          type="password"
          required
          minLength={6}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-400">Code admin mis à jour.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : "Changer le code admin"}
      </button>
    </form>
  );
}
