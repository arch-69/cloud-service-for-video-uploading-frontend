import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";

import UploadProgress from "./UploadProgress";
import UploadStatus from "./UploadStatus";

import {
  useMultipartUpload,
} from "../../hooks/useMultipartUpload";

export default function UploadComponent() {
  const {
    progress,
    status,
    uploadedParts,
    uploadFile,
    error,
  } = useMultipartUpload();

  const isUploading =
    status === "UPLOADING";

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-white/10 px-7 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-300/70">
                  CloudDock Upload
                </p>

                <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-white">
                  Multipart Upload
                </h1>

                <p className="mt-1 text-[12px] text-white/45">
                  Secure, resumable uploads with real-time chunk tracking.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                <UploadCloud
                  size={22}
                  className="text-indigo-300"
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6 px-7 py-6">
            {/* Upload Input */}
            <label className="group flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-5 py-4 transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/[0.04]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <UploadCloud
                    size={18}
                    className="text-white/70"
                  />
                </div>

                <div>
                  <p className="text-[13px] font-medium text-white/85">
                    Select a file
                  </p>

                  <span className="text-[11px] text-white/45">
                    Upload large files using multipart chunks
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-medium text-white/70 transition group-hover:border-indigo-400/20 group-hover:bg-indigo-500/10 group-hover:text-indigo-200">
                Browse
              </div>

              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  uploadFile(
                    e.target.files?.[0]
                  )
                }
              />
            </label>

            {/* Status */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">
                      Upload Progress
                    </p>

                    <h3 className="mt-1 text-[20px] font-semibold text-white">
                      {progress}%
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                    <Activity
                      size={18}
                      className={`${
                        isUploading
                          ? "text-indigo-300"
                          : "text-white/60"
                      }`}
                    />
                  </div>
                </div>

                <UploadProgress
                  progress={progress}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">
                      Current Status
                    </p>

                    <h3 className="mt-1 text-[20px] font-semibold text-white">
                      {status || "Idle"}
                    </h3>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      error
                        ? "border-rose-500/20 bg-rose-500/10"
                        : "border-emerald-500/20 bg-emerald-500/10"
                    }`}
                  >
                    {error ? (
                      <AlertCircle
                        size={18}
                        className="text-rose-300"
                      />
                    ) : (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-300"
                      />
                    )}
                  </div>
                </div>

                <UploadStatus
                  status={status}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
                <p className="text-[12px] font-medium text-rose-200">
                  Upload failed
                </p>

                <span className="mt-1 block text-[11px] text-rose-200/70">
                  {error}
                </span>
              </div>
            )}

            {/* Uploaded Parts */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1120]/80">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <h3 className="text-[13px] font-semibold text-white">
                    Uploaded Parts
                  </h3>

                  <p className="mt-0.5 text-[11px] text-white/40">
                    Real-time multipart chunk response
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-white/50">
                  {uploadedParts?.length || 0} chunks
                </span>
              </div>

              <div className="max-h-[260px] overflow-auto">
                <pre className="p-5 text-[11px] leading-6 text-emerald-200/80">
                  {JSON.stringify(
                    uploadedParts,
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}