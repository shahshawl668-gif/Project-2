"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ApplicationsTable } from "@/components/applications-table";
import { EmptyState } from "@/components/empty-state";
import { KanbanBoard } from "@/components/kanban-board";
import { LoadingState } from "@/components/loading-state";
import {
  ApiError,
  deleteApplication,
  fetchApplications,
  updateApplication,
} from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useApplicationViewStore } from "@/store/application-view-store";
import type { Application, ApplicationView, ApplicationStatus } from "@/types/job-tracker";

export default function ApplicationsPage() {
  const token = useAuthStore((state) => state.token);
  const view = useApplicationViewStore((state) => state.view);
  const setView = useApplicationViewStore((state) => state.setView);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const authToken = token;

    async function loadApplications() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchApplications(authToken);
        setApplications(response);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to load applications.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadApplications();
  }, [token]);

  async function handleDelete(id: string) {
    if (!token) return;
    try {
      await deleteApplication(token, id);
      setApplications((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to delete the application.");
    }
  }

  async function handleMove(id: string, status: ApplicationStatus) {
    if (!token) return;
    const previous = applications;
    setApplications((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    try {
      const updated = await updateApplication(token, id, { status });
      setApplications((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
    } catch (err) {
      setApplications(previous);
      setError(err instanceof ApiError ? err.message : "Unable to update the application status.");
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading applications..." />;
  }

  if (error && !applications.length) {
    return <EmptyState title="Could not load applications" description={error} />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-lg shadow-black/20 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Application tracker</h3>
          <p className="mt-1 text-sm text-slate-400">
            Switch between a detailed table and a kanban board view.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {(["table", "kanban"] as ApplicationView[]).map((nextView) => (
            <button
              key={nextView}
              type="button"
              onClick={() => setView(nextView)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                view === nextView
                  ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950"
                  : "border border-white/10 bg-slate-950/70 text-slate-300"
              }`}
            >
              {nextView === "table" ? "Table view" : "Kanban view"}
            </button>
          ))}
          <Link
            href="/applications/new"
            className="rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:from-teal-300 hover:to-cyan-400"
          >
            Add application
          </Link>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {!applications.length ? (
        <EmptyState
          title="No applications tracked yet"
          description="Create your first application to unlock analytics, reminders, and AI insights."
        />
      ) : view === "table" ? (
        <ApplicationsTable applications={applications} onDelete={handleDelete} />
      ) : (
        <KanbanBoard applications={applications} onMove={handleMove} />
      )}
    </div>
  );
}
