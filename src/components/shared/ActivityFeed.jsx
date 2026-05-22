import { formatDateTime } from "../../utils/format.utils";

export default function ActivityFeed({ activities }) {
  if (!activities.length) {
    return (
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#111827]/70 p-4 sm:p-5 backdrop-blur-xl">
        <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-white/30" />
          </div>

          <p className="text-[12px] sm:text-[13px] font-medium text-white/80">
            No recent activity
          </p>

          <span className="mt-1 text-[10px] sm:text-[11px] text-white/40">
            Uploads and system events will appear here.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#111827]/70 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 px-4 sm:px-5 py-3 sm:py-4">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-[14px] font-semibold text-white">
            Recent activity
          </h3>

          <p className="mt-0.5 text-[10px] sm:text-[11px] text-white/45">
            Latest upload and workspace events
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium text-white/50 whitespace-nowrap shrink-0">
          {activities.length} events
        </span>
      </div>

      {/* Feed */}
      <ul className="divide-y divide-white/5 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
        {activities.map((activity) => {
          const statusTone =
            activity.status === "SUCCESS"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : activity.status === "FAILED"
              ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
              : activity.status === "WARNING"
              ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
              : "border-white/10 bg-white/[0.03] text-white/60";

          return (
            <li
              key={activity.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex min-w-0 items-start gap-2 sm:gap-3">
                {/* Timeline Dot */}
                <div className="mt-0.5 sm:mt-1.5 flex h-2 sm:h-2.5 w-2 sm:w-2.5 flex-shrink-0 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.7)]" />

                {/* Content */}
                <div className="min-w-0">
                  <p className="truncate text-[11px] sm:text-[12.5px] font-medium text-white/88">
                    {activity.message}
                  </p>

                  <span className="mt-0.5 sm:mt-1 block text-[9px] sm:text-[10.5px] text-white/40">
                    {formatDateTime(activity.timestamp)}
                  </span>
                </div>
              </div>

              {/* Status */}
              <span
                className={`flex-shrink-0 rounded-full border px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium whitespace-nowrap ${statusTone}`}
              >
                {activity.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}