import { getSession } from "@/lib/session";
import { getCalls } from "@/lib/data";
import { CallsTable } from "@/components/CallsTable";

export default async function CallsPage() {
  const [session, calls] = await Promise.all([getSession(), getCalls()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
          Calls &amp; Roleplays
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Historique des calls clients et sessions de roleplay.
        </p>
      </div>

      <CallsTable calls={calls} isAdmin={session?.role === "admin"} />
    </div>
  );
}
