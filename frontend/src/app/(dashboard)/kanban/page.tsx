"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { KanbanBoard } from "@/components/kanban-board";
import { LoadingState } from "@/components/loading-state";
import { ApiError, fetchApplications, updateApplication } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { Application, ApplicationStatus } from "@/types/job-tracker";

export default function KanbanPage() {
  const token = useAuthStore((state) => state.token);
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
        setError(err instanceof ApiError ? err.message : "Unable to load the kanban board.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadApplications();
  }, [token]);

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
      setError(err instanceof ApiError ? err.message : "Unable to update application status.");
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading kanban board..." />;
  }

  if (!applications.length) {
    return (
      <EmptyState
        title="No applications to organize"
        description="Add applications first, then drag them across stages here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      <KanbanBoard applications={applications} onMove={handleMove} />
    </div>
  );
}
