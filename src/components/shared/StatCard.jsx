import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

export default function StatCard({
  label,
  value,
  hint,
  trend,
}) {
  const trendStyles = {
    positive:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    negative:
      "border-rose-500/20 bg-rose-500/10 text-rose-300",
    warning:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
    neutral:
      "border-white/10 bg-white/[0.03] text-white/60",
  };

  const TrendIcon =
    trend?.type === "positive"
      ? ArrowUpRight
      : trend?.type === "negative"
      ? ArrowDownRight
      : Minus;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/70 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/15 hover:bg-[#141c2b]/80">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            {label}
          </p>
        </div>

        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${trendStyles[trend.type] || trendStyles.neutral}`}
          >
            <TrendIcon size={11} />
            {trend.text}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="relative z-10 mt-4">
        <h3 className="text-[24px] font-semibold tracking-tight text-white">
          {value}
        </h3>

        {hint && (
          <p className="mt-1 text-[11px] text-white/45">
            {hint}
          </p>
        )}
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-indigo-500/40 via-sky-400/20 to-transparent opacity-70" />
    </div>
  );
}