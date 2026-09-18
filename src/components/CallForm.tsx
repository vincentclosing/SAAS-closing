"use client";

import { useActionState, useEffect } from "react";
import {
  createCallAction,
  updateCallAction,
  type CallEntry,
  type CallsActionState,
} from "@/app/actions/calls";

const initialState: CallsActionState = { error: null };

export function CallForm({
  call,
  onDone,
  onCancel,
}: {
  call?: CallEntry;
  onDone: () => void;
  onCancel: () => void;
}) {
  const action = call ? updateCallAction : createCallAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
    >
      {call && <input type="hidden" name="id" value={call.id} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">
            Titre / nom du call
          </span>
          <input
            name="title"
            type="text"
            required
            defaultValue={call?.title}
            placeholder="Ex : Call découverte — Jean D."
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Date</span>
          <input
            name="call_date"
            type="date"
            required
            defaultValue={call?.call_date}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Type</span>
          <select
            name="call_type"
            defaultValue={call?.call_type ?? "client"}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
          >
            <option value="client">Call client</option>
            <option value="roleplay">Roleplay</option>
          </select>
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">
            Lien vers l&apos;enregistrement
          </span>
          <input
            name="recording_url"
            type="url"
            defaultValue={call?.recording_url ?? ""}
            placeholder="https://loom.com/..."
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
          />
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">
            Note / feedback
          </span>
          <textarea
            name="notes"
            rows={3}
            defaultValue={call?.notes ?? ""}
            placeholder="Points forts, axes d'amélioration..."
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
          />
        </label>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-50"
        >
          {pending ? "Enregistrement..." : call ? "Mettre à jour" : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
