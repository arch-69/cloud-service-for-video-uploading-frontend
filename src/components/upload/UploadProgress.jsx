export default function UploadProgress({
  progress,
}) {
  const safeProgress = Math.min(
    Math.max(progress || 0, 0),
    100
  );

  return (
    <div className="w-full">
      {/* Top Row */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
            Upload Progress
          </p>

          <h3 className="mt-1 text-[18px] font-semibold text-white">
            {safeProgress}%
          </h3>
        </div>

        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
          {safeProgress === 100
            ? "Completed"
            : "Uploading"}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(99,102,241,0.18),transparent_55%)]" />

        {/* Fill */}
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-300 ease-out"
          style={{
            width: `${safeProgress}%`,
          }}
        >
          {/* Shine */}
          <div className="absolute inset-0 animate-pulse bg-white/10" />
        </div>
      </div>

      {/* Bottom Labels */}
      <div className="mt-2 flex items-center justify-between text-[10.5px] text-white/35">
        <span>0%</span>
        <span>Encrypted multipart transfer</span>
        <span>100%</span>
      </div>
    </div>
  );
}