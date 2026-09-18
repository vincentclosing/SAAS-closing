import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { NavBar } from "@/components/NavBar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-full flex-col">
      <NavBar role={session.role} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-600">
        Closer Stats — dashboard privé
      </footer>
    </div>
  );
}
