import { getSession } from "@/lib/session";
import { getKpis } from "@/lib/data";
import { KpiCards } from "@/components/KpiCards";
import { KpiEditForm } from "@/components/KpiEditForm";

export default async function DashboardPage() {
  const [session, kpis] = await Promise.all([getSession(), getKpis()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Vue d&apos;ensemble des performances de closing.
        </p>
      </div>

      <KpiCards kpis={kpis} />

      {session?.role === "admin" && <KpiEditForm kpis={kpis} />}
    </div>
  );
}
