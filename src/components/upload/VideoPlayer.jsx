import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  PlayCircle,
  FileText,
  Image as ImageIcon,
  Music2,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { getStreamingUrlApi } from "../../api/upload.api";

export default function VideoPlayer({ keyId }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [mediaCategory, setMediaCategory] = useState(null);

  useEffect(() => {
    if (!keyId) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await getStreamingUrlApi({ key: keyId });

        let payload = resp;
        if (payload?.data) payload = payload.data;

        let resolvedUrl = null;
        let resolvedMime = null;
        let resolvedName = null;

        if (typeof payload === "string") {
          resolvedUrl = payload;
        } else if (payload && typeof payload === "object") {
          resolvedUrl =
            payload.url ||
            payload.signedUrl ||
            payload.path ||
            null;

          resolvedMime =
            payload.contentType ||
            payload.content_type ||
            payload.mime ||
            null;

          resolvedName =
            payload.filename ||
            payload.name ||
            null;
        }

        if (!resolvedUrl) {
          throw new Error("No URL returned from server");
        }

        const inferTypeFromUrl = (u) => {
          const ext = (u || "")
            .split("?")[0]
            .split(".")
            .pop()
            ?.toLowerCase();

          if (!ext) return "other";

          const videoExts = [
            "mp4",
            "webm",
            "ogg",
            "mov",
            "mkv",
          ];

          const imageExts = [
            "png",
            "jpg",
            "jpeg",
            "gif",
            "webp",
            "svg",
          ];

          const audioExts = [
            "mp3",
            "wav",
            "aac",
            "m4a",
            "ogg",
          ];

          if (videoExts.includes(ext)) return "video";
          if (imageExts.includes(ext)) return "image";
          if (audioExts.includes(ext)) return "audio";
          if (ext === "pdf") return "pdf";

          return "other";
        };

        let category = "other";

        if (resolvedMime) {
          if (resolvedMime.startsWith("video/")) {
            category = "video";
          } else if (resolvedMime.startsWith("image/")) {
            category = "image";
          } else if (resolvedMime.startsWith("audio/")) {
            category = "audio";
          } else if (
            resolvedMime === "application/pdf"
          ) {
            category = "pdf";
          }
        } else {
          category = inferTypeFromUrl(resolvedUrl);
        }

        if (!mounted) return;

        setUrl(resolvedUrl);
        setFileName(resolvedName);
        setMediaCategory(category);
      } catch (err) {
        if (!mounted) return;

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load media"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [keyId]);

  const mediaMeta = useMemo(() => {
    switch (mediaCategory) {
      case "video":
        return {
          label: "Video Preview",
          icon: PlayCircle,
        };

      case "image":
        return {
          label: "Image Preview",
          icon: ImageIcon,
        };

      case "audio":
        return {
          label: "Audio Preview",
          icon: Music2,
        };

      case "pdf":
        return {
          label: "Document Preview",
          icon: FileText,
        };

      default:
        return {
          label: "File Preview",
          icon: FileText,
        };
    }
  }, [mediaCategory]);

  const goBack = () => {
    if (window.history.state !== null) {
      window.history.back();
    } else {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const MediaIcon = mediaMeta.icon;

  return (
    <section className="min-h-screen bg-[#060816] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={goBack}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 text-indigo-200">
                  <MediaIcon size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-white md:text-base">
                    {fileName || "Media Preview"}
                  </h2>

                  <p className="mt-0.5 text-xs text-white/45">
                    {mediaMeta.label}
                  </p>
                </div>
              </div>
            </div>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <Download size={15} />
                Download
              </a>
            )}
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {loading && (
              <div className="flex h-[70vh] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0b1020]/60">
                <Loader2
                  size={34}
                  className="animate-spin text-indigo-300"
                />

                <p className="mt-4 text-sm text-white/60">
                  Loading media preview...
                </p>
              </div>
            )}

            {error && (
              <div className="flex h-[50vh] flex-col items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/5 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
                  <AlertCircle size={26} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">
                  Failed to load preview
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && url && (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
                
                {mediaCategory === "video" && (
                  <video
                    className="max-h-[78vh] w-full bg-black"
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                    src={url}
                  />
                )}

                {mediaCategory === "audio" && (
                  <div className="flex min-h-[320px] flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#111827] px-6 py-12">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-200">
                      <Music2 size={40} />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-white">
                      Audio Playback
                    </h3>

                    <p className="mt-2 text-sm text-white/50">
                      {fileName || "Audio file"}
                    </p>

                    <audio
                      className="mt-8 w-full max-w-2xl"
                      controls
                      src={url}
                    />
                  </div>
                )}

                {mediaCategory === "image" && (
                  <div className="flex items-center justify-center bg-[#020617] p-4">
                    <img
                      src={url}
                      alt={fileName || "Preview"}
                      className="max-h-[78vh] rounded-2xl object-contain shadow-2xl"
                    />
                  </div>
                )}

                {mediaCategory === "pdf" && (
                  <iframe
                    title={fileName || "Document"}
                    src={url}
                    className="h-[78vh] w-full bg-white"
                  />
                )}

                {mediaCategory === "other" && (
                  <div className="flex h-[55vh] flex-col items-center justify-center bg-[#0b1020] px-6 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.05] text-white/70">
                      <FileText size={36} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      Preview unavailable
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
                      This file type cannot be previewed directly
                      in the browser.
                    </p>

                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-3 text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
                    >
                      <Download size={16} />
                      Open / Download File
                    </a>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && !url && (
              <div className="flex h-[50vh] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0b1020]/60">
                <p className="text-sm text-white/45">
                  No preview available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}