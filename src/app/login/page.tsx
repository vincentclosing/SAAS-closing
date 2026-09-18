import { redirect } from "next/navigation";
import { isAppConfigured } from "@/lib/config";
import { LoginTabs } from "@/components/LoginForms";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const configured = await isAppConfigured();
  if (!configured) redirect("/setup");

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
            Closer<span className="text-indigo-400">.stats</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Suivi de performance de closing
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <LoginTabs />
        </div>
      </div>
    </div>
  );
}
