"use client";

import { useActionState, useState } from "react";
import {
  loginAdminAction,
  loginVisitorAction,
  type ActionState,
} from "@/app/actions/auth";

const initialState: ActionState = { error: null };

function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Nom d&apos;utilisateur
        </span>
        <input
          name="username"
          type="text"
          required
          autoFocus
          autoComplete="username"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">Code</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-50"
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

function VisitorLoginForm() {
  const [state, formAction, pending] = useActionState(loginVisitorAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Code d&apos;accès
        </span>
        <input
          name="code"
          type="password"
          required
          autoFocus
          placeholder="Code fourni par le closer"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-50"
      >
        {pending ? "Connexion..." : "Accéder au dashboard"}
      </button>
    </form>
  );
}

export function LoginTabs() {
  const [tab, setTab] = useState<"visitor" | "admin">("visitor");

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
        <button
          type="button"
          onClick={() => setTab("visitor")}
          className={`rounded-md py-2 text-sm font-medium transition-colors ${
            tab === "visitor"
              ? "bg-zinc-800 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Visiteur
        </button>
        <button
          type="button"
          onClick={() => setTab("admin")}
          className={`rounded-md py-2 text-sm font-medium transition-colors ${
            tab === "admin"
              ? "bg-zinc-800 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Admin
        </button>
      </div>

      {tab === "visitor" ? <VisitorLoginForm /> : <AdminLoginForm />}
    </div>
  );
}
