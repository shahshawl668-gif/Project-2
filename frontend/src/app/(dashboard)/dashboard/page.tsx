"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { InsightCard } from "@/components/insight-card";
import { LoadingState } from "@/components/loading-state";
import { MetricCard } from "@/components/metric-card";
import { TrendChart } from "@/components/trend-chart";
import { ApiError, fetchAnalytics } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { Analytics } from "@/types/job-tracker";

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const authToken = token;

    async function loadAnalytics() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAnalytics(authToken);
        setAnalytics(response);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadAnalytics();
  }, [token]);

  if (isLoading) {
    return <LoadingState label="Loading dashboard metrics..." />;
  }

  if (error) {
    return <EmptyState title="Dashboard unavailable" description={error} />;
  }

  if (!analytics) {
    return <EmptyState title="No analytics yet" description="Add applications to populate your dashboard." />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total applications"
          value={String(analytics.total_applications)}
          description="All tracked opportunities across your pipeline."
        />
        <MetricCard
          label="Interview rate"
          value={`${analytics.interview_rate}%`}
          description="Interviews divided by total applications."
        />
        <MetricCard
          label="Offer rate"
          value={`${analytics.offer_rate}%`}
          description="Offers divided by total applications."
        />
        <MetricCard
          label="Average match"
          value={`${analytics.average_match_score}%`}
          description="Average AI match score for saved applications."
        />
      </section>

      {analytics.weekly_trend.length ? (
        <TrendChart points={analytics.weekly_trend} />
      ) : (
        <EmptyState
          title="No weekly trend yet"
          description="Once you add applications, your weekly application trend will appear here."
        />
      )}

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Smart insights</h3>
          <p className="mt-1 text-sm text-slate-400">
            Automated suggestions based on your conversion metrics and AI match scores.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {analytics.insights.map((insight) => (
            <InsightCard key={`${insight.title}-${insight.severity}`} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  );
}
