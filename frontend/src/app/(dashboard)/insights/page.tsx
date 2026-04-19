"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { InsightCard } from "@/components/insight-card";
import { LoadingState } from "@/components/loading-state";
import { ApiError, fetchAnalytics, fetchApplications } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { Analytics, Application } from "@/types/job-tracker";

export default function InsightsPage() {
  const token = useAuthStore((state) => state.token);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const authToken = token;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [analyticsResponse, applicationsResponse] = await Promise.all([
          fetchAnalytics(authToken),
          fetchApplications(authToken),
        ]);
        setAnalytics(analyticsResponse);
        setApplications(applicationsResponse);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to load insights.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token]);

  const lowMatchApplications = useMemo(
    () =>
      applications
        .filter((application) => (application.match_score ?? 100) < 55)
        .sort((a, b) => (a.match_score ?? 100) - (b.match_score ?? 100))
        .slice(0, 5),
    [applications],
  );

  const reminderApplications = useMemo(
    () =>
      applications.filter(
        (application) =>
          application.reminders.needs_follow_up ||
          application.reminders.needs_interview_reminder,
      ),
    [applications],
  );

  if (isLoading) {
    return <LoadingState label="Loading insights..." />;
  }

  if (error) {
    return <EmptyState title="Insights unavailable" description={error} />;
  }

  if (!analytics) {
    return <EmptyState title="No insights yet" description="Track applications to unlock insight cards." />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-3">
        {analytics.insights.map((insight) => (
          <InsightCard key={`${insight.title}-${insight.severity}`} insight={insight} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-lg shadow-black/20">
          <h3 className="text-lg font-semibold text-slate-100">Low-match applications</h3>
          <p className="mt-2 text-sm text-slate-400">
            Focus on updating these resumes before applying to similar roles again.
          </p>

          <div className="mt-5 space-y-3">
            {lowMatchApplications.length ? (
              lowMatchApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">
                        {application.company_name}
                      </p>
                      <p className="text-sm text-slate-400">{application.role}</p>
                    </div>
                    <span className="rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
                      {application.match_score ?? 0}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-sm text-slate-400">
                No low-match applications detected.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-lg shadow-black/20">
          <h3 className="text-lg font-semibold text-slate-100">Reminder queue</h3>
          <p className="mt-2 text-sm text-slate-400">
            Applications that may need a follow-up or interview preparation reminder.
          </p>

          <div className="mt-5 space-y-3">
            {reminderApplications.length ? (
              reminderApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">
                        {application.company_name}
                      </p>
                      <p className="text-sm text-slate-400">{application.role}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {application.reminders.needs_follow_up
                        ? `Follow up ${application.reminders.follow_up_date}`
                        : "Interview reminder"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-sm text-slate-400">
                No active reminders right now.
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
