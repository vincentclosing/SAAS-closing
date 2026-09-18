import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { VisitorCodeForm, AdminPasswordForm } from "@/components/AdminSettingsForms";

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
          Panel admin
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Gère l&apos;accès visiteur et tes identifiants admin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="mb-1 text-sm font-semibold text-zinc-100">
            Code visiteur
          </h2>
          <p className="mb-4 text-xs text-zinc-500">
            Ce code unique est partagé à tous les infopreneurs pour consulter
            le dashboard en lecture seule.
          </p>
          <VisitorCodeForm />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="mb-1 text-sm font-semibold text-zinc-100">
            Mon code admin
          </h2>
          <p className="mb-4 text-xs text-zinc-500">
            Change le code utilisé pour te connecter en tant qu&apos;admin.
          </p>
          <AdminPasswordForm />
        </div>
      </div>
    </div>
  );
}
