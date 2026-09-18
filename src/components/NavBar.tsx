import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import type { Role } from "@/lib/session";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/calls", label: "Calls / RP" },
];

export function NavBar({ role }: { role: Role }) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#08090a]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            Closer<span className="text-indigo-400">.stats</span>
          </span>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
              >
                {link.label}
              </Link>
            ))}
            {role === "admin" && (
              <Link
                href="/admin"
                className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
              role === "admin"
                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                : "border-zinc-700 bg-zinc-800/50 text-zinc-400"
            }`}
          >
            {role === "admin" ? "Admin" : "Visiteur"}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
