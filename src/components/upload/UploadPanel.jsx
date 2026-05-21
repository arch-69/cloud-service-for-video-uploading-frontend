import { useState } from "react";
import {
  UploadCloud,
  Pause,
  Play,
  X,
  Activity,
  ShieldCheck,
} from "lucide-react";

export default function UploadPanel({
  onUpload,
  onPause,
  onResume,
  onCancel,
  status,
  progress,
  isPaused,
  currentUpload,
  bitrateHistory,
  error,
}) {
  const [fileName, setFileName] = useState("");

  const waveform = (bitrateHistory || []).length
    ? bitrateHistory
    : [0, 0, 0, 0, 0, 0, 0, 0];

  const maxValue = Math.max(...waveform, 1);

  const points = waveform.map((value, index) => {
    const x = (index / (waveform.length - 1 || 1)) * 100;
    const normalized = value / maxValue;
    const y = 50 - normalized * 30;

    return { x, y };
  });

  const smoothPath = points.length
    ? points.reduce((acc, point, index, array) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`;
        }

        const prev = array[index - 1];
        const next = array[index + 1] || point;

        const controlX1 = prev.x + (point.x - prev.x) / 2;
        const controlY1 = prev.y + (point.y - prev.y) / 2;

        const controlX2 = point.x - (next.x - prev.x) / 6;
        const controlY2 = point.y - (next.y - prev.y) / 6;

        return `${acc} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${point.x} ${point.y}`;
      }, "")
    : "";

  const heartbeatTone =
    status === "FAILED" || status === "CANCELLED"
      ? "danger"
      : status === "PAUSED"
      ? "paused"
      : "success";

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 p-5 backdrop-blur-2xl">
      {/* Background Glow */}
      <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-start justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-[0.01em] text-white">
            Smart Multipart Upload
          </h3>

          <p className="mt-1 text-[10.5px] leading-relaxed text-white/45">
            Secure, resumable uploads with parallel acceleration and live
            monitoring.
          </p>
        </div>

        <div className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-indigo-200">
          Multi-part v2
        </div>
      </div>

      {/* Upload Area */}
      <div className="relative mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/30 hover:bg-white/[0.04]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10">
            <UploadCloud size={26} className="text-white" />
          </div>

          <h4 className="text-[12px] font-medium text-white">
            {fileName || "Choose a file to upload"}
          </h4>

          <p className="mt-1 text-[10px] text-white/40">
            Max 5GB • Encrypted in transit • Chunk optimized
          </p>

          <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-medium text-white transition hover:bg-white/[0.08]">
            <UploadCloud size={14} />
            Select File

            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      {/* Upgrade Card */}
      {error && error.response?.status === 429 && (
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-amber-300" />

              <h3 className="text-[12px] font-semibold text-white">
                Upgrade Required
              </h3>
            </div>

            <p className="mt-2 text-[10.5px] leading-relaxed text-white/55">
              Your free plan has reached its upload limit. Upgrade to Premium
              for larger uploads, priority bandwidth, and higher reliability.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                className="rounded-xl bg-white px-4 py-2 text-[11px] font-medium text-black transition hover:opacity-90"
                onClick={() => {
                  window.history.pushState({}, "", "/pricing");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
              >
                Upgrade Plan
              </button>

              <button
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-medium text-white transition hover:bg-white/[0.06]"
                onClick={() => {
                  window.history.pushState({}, "", "/support");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          {
            label: "Status",
            value: status,
          },
          {
            label: "Progress",
            value: `${progress}%`,
          },
          {
            label: "Throughput",
            value: bitrateHistory?.length
              ? `${bitrateHistory[bitrateHistory.length - 1]} Mbps`
              : "—",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
          >
            <p className="text-[10px] tracking-wide text-white/40">
              {item.label}
            </p>

            <h4 className="mt-1 text-[12px] font-semibold text-white">
              {item.value}
            </h4>
          </div>
        ))}
      </div>

      {/* Live Bitrate Graph */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-300" />

            <span className="text-[11px] font-medium text-white">
              Live Throughput
            </span>
          </div>

          <span className="text-[10px] text-white/40">
            Real-time transfer rate
          </span>
        </div>

        <div className={`bitrate-graph heartbeat ${heartbeatTone}`}>
          <svg
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className={`h-28 w-full ${
              status === "UPLOADING" ? "pulse" : ""
            }`}
          >
            <defs>
              <linearGradient
                id="uploadGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            <path
              d={smoothPath}
              fill="none"
              stroke="url(#uploadGradient)"
              strokeWidth="2.4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] tracking-wide text-white/40">
            Upload Progress
          </span>

          <span className="text-[10px] font-medium text-white/60">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={isPaused ? onResume : onPause}
          disabled={!currentUpload || status === "COMPLETED"}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[11px] font-medium text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}

          {isPaused ? "Resume Upload" : "Pause Upload"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={!currentUpload || status === "COMPLETED"}
          className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-5 py-3 text-[11px] font-medium text-red-200 transition hover:bg-red-500/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </div>
  );
}