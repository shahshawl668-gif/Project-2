interface MetricCardProps {
  label: string;
  value: string;
  description: string;
}

export function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </article>
  );
}
