"use client";

import { useActionState, useState } from "react";
import { updateKpisAction, type KpisActionState } from "@/app/actions/kpis";
import type { Kpis } from "@/lib/data";

const initialState: KpisActionState = { error: null };

const fields: { key: keyof Kpis; label: string; step?: string; suffix?: string }[] = [
  { key: "calls_count", label: "Nombre de calls", step: "1" },
  { key: "closing_rate", label: "Taux de closing", step: "0.1", suffix: "%" },
  { key: "show_up_rate", label: "Taux de show up", step: "0.1", suffix: "%" },
  { key: "cash_contracted", label: "Cash contracté", step: "1", suffix: "€" },
  { key: "cash_collected", label: "Cash collecté", step: "1", suffix: "€" },
];

export function KpiEditForm({ kpis }: { kpis: Kpis }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateKpisAction, initialState);

  if (!open) {
    return (
      <div className="mt-4 flex flex-col items-end gap-2">
        {state.success && (
          <p className="text-sm text-emerald-400">Stats mises à jour.</p>
        )}
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          Modifier les stats
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {fields.map((field) => (
            <label key={field.key} className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-zinc-400">
                {field.label} {field.suffix ? `(${field.suffix})` : ""}
              </span>
              <input
                name={field.key}
                type="number"
                step={field.step}
                min={0}
                defaultValue={kpis[field.key]}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
              />
            </label>
          ))}
        </div>

        {state.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
        {state.success && (
          <p className="text-sm text-emerald-400">Stats mises à jour.</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-50"
          >
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
          >
            {state.success ? "Fermer" : "Annuler"}
          </button>
        </div>
      </form>
    </div>
  );
}
