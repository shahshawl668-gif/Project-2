"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { useAuthStore } from "@/store/auth-store";

const noopSubscribe = () => () => {};

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, router, token]);

  const pageTitle = useMemo(() => {
    if (pathname.startsWith("/applications/new")) return "Add a new application";
    if (pathname.startsWith("/applications")) return "Track your application pipeline";
    if (pathname.startsWith("/kanban")) return "Move opportunities through the funnel";
    if (pathname.startsWith("/insights")) return "Actionable insights";
    return "Dashboard";
  }, [pathname]);

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <div className="rounded-2xl border border-white/10 bg-slate-950/85 px-6 py-4 text-sm text-slate-300 shadow-2xl shadow-black/30 backdrop-blur">
          Loading your workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar />
        <main className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <header className="border-b border-white/10 pb-5">
            <h2 className="text-3xl font-semibold">{pageTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Stay on top of applications, conversion metrics, and AI-powered resume feedback.
            </p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
