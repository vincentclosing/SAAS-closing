import type { Kpis } from "@/lib/data";

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${Number(value).toFixed(1).replace(/\.0$/, "")}%`;
}

const cards = (kpis: Kpis) => [
  {
    label: "Calls",
    value: kpis.calls_count.toLocaleString("fr-FR"),
    accent: "from-indigo-500/15 to-indigo-500/0",
  },
  {
    label: "Taux de closing",
    value: formatPercent(kpis.closing_rate),
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    label: "Taux de show up",
    value: formatPercent(kpis.show_up_rate),
    accent: "from-sky-500/15 to-sky-500/0",
  },
  {
    label: "Cash contracté",
    value: formatEuro(kpis.cash_contracted),
    accent: "from-violet-500/15 to-violet-500/0",
  },
  {
    label: "Cash collecté",
    value: formatEuro(kpis.cash_collected),
    accent: "from-amber-500/15 to-amber-500/0",
  },
];

export function KpiCards({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards(kpis).map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-b ${card.accent} bg-zinc-900/40 p-5`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {card.label}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
