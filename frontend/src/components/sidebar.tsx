"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/applications/new", label: "Add Application" },
  { href: "/kanban", label: "Kanban Board" },
  { href: "/insights", label: "Insights" },
];

export function Sidebar() {
  const pathname = usePathname();
  const email = useAuthStore((state) => state.email);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <aside className="flex w-full max-w-xs flex-col gap-6 rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-black/30 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-300">
          JobTracker AI
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          Application command center
        </h1>
        <p className="mt-2 text-sm text-slate-400">{email ?? "Signed out"}</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={clearSession}
        className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
      >
        Log out
      </button>
    </aside>
  );
}
