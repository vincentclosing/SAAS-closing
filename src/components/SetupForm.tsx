"use client";

import { useActionState } from "react";
import { setupAdminAction, type ActionState } from "@/app/actions/auth";

const initialState: ActionState = { error: null };

export function SetupForm() {
  const [state, formAction, pending] = useActionState(setupAdminAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Nom d&apos;utilisateur admin
        </span>
        <input
          name="username"
          type="text"
          required
          minLength={3}
          autoFocus
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Code admin (min. 6 caractères)
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Code visiteur (min. 4 caractères, partagé aux infopreneurs)
        </span>
        <input
          name="visitorCode"
          type="text"
          required
          minLength={4}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-50"
      >
        {pending ? "Configuration..." : "Initialiser le dashboard"}
      </button>
    </form>
  );
}
