import {
  FileVideo,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import {
  formatBytes,
  formatDateTime,
} from "../../utils/format.utils";

export default function UploadList({ records, title }) {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#060B16]/95 p-4 sm:p-5 backdrop-blur-2xl">
      {/* Background Glow */}
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3 sm:pb-4">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold tracking-[0.01em] text-white">
            {title}
          </h3>

          <p className="mt-1 text-[10px] sm:text-[10.5px] text-white/40">
            Recent uploads and processing activity
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[9px] sm:text-[10px] font-medium text-white/60 whitespace-nowrap shrink-0">
          {records.length} items
        </div>
      </div>

      {/* List */}
      <div className="relative mt-4 sm:mt-5">
        {records.length ? (
          <ul className="space-y-2 sm:space-y-3">
            {records.map((record) => (
              <li
                key={record.id}
                onClick={() => {
                  if (!record.key) return;

                  const encoded = encodeURIComponent(record.key);

                  window.history.pushState(
                    {},
                    "",
                    `/video/${encoded}`
                  );

                  window.dispatchEvent(
                    new PopStateEvent("popstate")
                  );
                }}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 transition-all duration-200 ${
                  record.key
                    ? "cursor-pointer hover:border-indigo-500/20 hover:bg-white/[0.05]"
                    : "cursor-default"
                }`}
              >
                {/* Hover Glow */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/0 blur-2xl transition group-hover:bg-indigo-500/10" />

                <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left Side */}
                  <div className="flex min-w-0 items-start gap-2 sm:gap-3">
                    {/* File Icon */}
                    <div className="flex h-10 sm:h-11 w-10 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-cyan-500/10">
                      <FileVideo
                        size={18}
                        className="text-white/80"
                      />
                    </div>

                    {/* File Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="truncate text-[11px] sm:text-[12px] font-medium text-white">
                          {record.fileName}
                        </p>

                        {record.key && (
                          <ArrowUpRight
                            size={13}
                            className="shrink-0 opacity-0 text-white/40 transition group-hover:opacity-100"
                          />
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] text-white/40">
                        <span>{formatBytes(record.fileSize)}</span>

                        <span className="h-1 w-1 rounded-full bg-white/20" />

                        <span>{record.status}</span>

                        <span className="h-1 w-1 rounded-full bg-white/20" />

                        <div className="flex items-center gap-1">
                          <Clock3 size={10} />
                          <span>
                            {formatDateTime(record.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    {/* Progress */}
                    <div className="hidden w-20 sm:block sm:w-24">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-wide text-white/35">
                          Progress
                        </span>

                        <span className="text-[9px] sm:text-[10px] text-white/50">
                          {record.progress || 0}%
                        </span>
                      </div>

                      <div className="h-1 sm:h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                          style={{
                            width: `${record.progress || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className={`flex items-center gap-1 rounded-full border px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-medium whitespace-nowrap shrink-0 ${
                        record.status === "COMPLETED"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                          : record.status === "FAILED"
                          ? "border-red-500/20 bg-red-500/10 text-red-200"
                          : record.status === "UPLOADING"
                          ? "border-sky-500/20 bg-sky-500/10 text-sky-200"
                          : "border-white/10 bg-white/[0.04] text-white/60"
                      }`}
                    >
                      {record.status === "COMPLETED" && (
                        <CheckCircle2 size={11} />
                      )}

                      <span className="hidden sm:inline">{record.status}</span>
                      <span className="sm:hidden">{record.status.slice(0, 3)}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 sm:px-6 py-8 sm:py-14 text-center">
            <div className="mb-3 sm:mb-4 flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04]">
              <FileVideo
                size={20}
                className="text-white/40"
              />
            </div>

            <h4 className="text-[11px] sm:text-[12px] font-medium text-white">
              No uploads yet
            </h4>

            <p className="mt-1 max-w-xs text-[9.5px] sm:text-[10.5px] leading-relaxed text-white/40">
              Uploaded videos and processing activity will appear
              here once uploads begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}