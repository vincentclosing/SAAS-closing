"use client";

import { useState, useTransition } from "react";
import type { CallEntry } from "@/app/actions/calls";
import { deleteCallAction } from "@/app/actions/calls";
import { CallForm } from "@/components/CallForm";

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const typeLabel: Record<CallEntry["call_type"], string> = {
  client: "Call client",
  roleplay: "Roleplay",
};

const typeBadge: Record<CallEntry["call_type"], string> = {
  client: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  roleplay: "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

export function CallsTable({
  calls,
  isAdmin,
}: {
  calls: CallEntry[];
  isAdmin: boolean;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Supprimer cette entrée ?")) return;
    setPendingDeleteId(id);
    startTransition(async () => {
      await deleteCallAction(id);
      setPendingDeleteId(null);
    });
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex justify-end">
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
            >
              + Ajouter une entrée
            </button>
          )}
        </div>
      )}

      {isAdmin && showAddForm && (
        <CallForm
          onDone={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {calls.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
          Aucun call ou roleplay pour le moment.
        </div>
      )}

      <div className="space-y-3">
        {calls.map((call) =>
          editingId === call.id ? (
            <CallForm
              key={call.id}
              call={call}
              onDone={() => setEditingId(null)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={call.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-zinc-50">{call.title}</h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${typeBadge[call.call_type]}`}
                    >
                      {typeLabel[call.call_type]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDate(call.call_date)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {call.recording_url && (
                    <a
                      href={call.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-indigo-500 hover:text-indigo-300"
                    >
                      Voir l&apos;enregistrement
                    </a>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setEditingId(call.id)}
                        className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-600 hover:text-white"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(call.id)}
                        disabled={isPending && pendingDeleteId === call.id}
                        className="rounded-md border border-red-900/50 px-3 py-1.5 text-xs text-red-400 hover:border-red-700 hover:text-red-300 disabled:opacity-50"
                      >
                        {isPending && pendingDeleteId === call.id
                          ? "Suppression..."
                          : "Supprimer"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {call.notes && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-400">
                  {call.notes}
                </p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
