import {
  CheckCircle2,
  XCircle,
  Loader2,
  PauseCircle,
  Clock3,
} from "lucide-react";

export default function UploadStatus({
  status,
}) {
  const currentStatus =
    status || "IDLE";

  const statusConfig = {
    COMPLETED: {
      label: "Completed",
      icon: CheckCircle2,
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },

    FAILED: {
      label: "Failed",
      icon: XCircle,
      className:
        "border-rose-500/20 bg-rose-500/10 text-rose-300",
    },

    UPLOADING: {
      label: "Uploading",
      icon: Loader2,
      className:
        "border-sky-500/20 bg-sky-500/10 text-sky-300",
      spin: true,
    },

    PAUSED: {
      label: "Paused",
      icon: PauseCircle,
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-300",
    },

    IDLE: {
      label: "Waiting",
      icon: Clock3,
      className:
        "border-white/10 bg-white/[0.04] text-white/60",
    },
  };

  const config =
    statusConfig[currentStatus] ||
    statusConfig.IDLE;

  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${config.className}`}
        >
          <Icon
            size={18}
            className={
              config.spin
                ? "animate-spin"
                : ""
            }
          />
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">
            Upload Status
          </p>

          <h3 className="mt-0.5 text-[14px] font-semibold text-white">
            {config.label}
          </h3>
        </div>
      </div>

      {/* Status Badge */}
      <span
        className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${config.className}`}
      >
        {config.label}
      </span>
    </div>
  );
}