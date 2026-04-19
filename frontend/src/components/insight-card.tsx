import type { InsightItem } from "@/types/job-tracker";

const severityStyles: Record<InsightItem["severity"], string> = {
  info: "border-cyan-400/20 bg-cyan-500/10 text-cyan-100",
  medium: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  high: "border-rose-400/20 bg-rose-500/10 text-rose-100",
};

export function InsightCard({ insight }: { insight: InsightItem }) {
  return (
    <article className={`rounded-3xl border p-5 ${severityStyles[insight.severity]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
        {insight.severity}
      </p>
      <h3 className="mt-3 text-lg font-semibold">{insight.title}</h3>
      <p className="mt-2 text-sm leading-6 opacity-90">{insight.message}</p>
    </article>
  );
}
