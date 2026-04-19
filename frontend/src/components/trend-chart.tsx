import type { TrendPoint } from "@/types/job-tracker";

export function TrendChart({ points }: { points: TrendPoint[] }) {
  const maxCount = Math.max(...points.map((point) => point.count), 1);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Weekly application trend</h3>
          <p className="text-sm text-slate-400">See how consistently you are applying week to week.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <div key={point.week_start} className="space-y-3">
            <div className="flex h-32 items-end rounded-2xl border border-white/5 bg-slate-950/80 p-3">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-cyan-500 to-teal-300 transition-all"
                style={{ height: `${(point.count / maxCount) * 100}%` }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">{point.count} applications</p>
              <p className="text-xs text-slate-400">{point.week_start}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
