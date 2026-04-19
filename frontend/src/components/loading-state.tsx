export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400 shadow-lg shadow-black/20">
      {label}
    </div>
  );
}
