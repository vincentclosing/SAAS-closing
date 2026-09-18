import { redirect } from "next/navigation";
import { isAppConfigured } from "@/lib/config";
import { SetupForm } from "@/components/SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const configured = await isAppConfigured();
  if (configured) redirect("/login");

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
            Closer<span className="text-indigo-400">.stats</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Première configuration du dashboard
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <SetupForm />
        </div>
      </div>
    </div>
  );
}
