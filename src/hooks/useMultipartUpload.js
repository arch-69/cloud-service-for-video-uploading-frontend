import { useRef, useState } from "react";

import { createChunks } from "../utils/chunk.utils";

import { uploadChunksInParallel } from "../utils/parallelUpload.utils";
import { MAX_PARALLEL_UPLOADS } from "../constants/upload.constants";

import {
  startMultipartUploadApi,
  completeMultipartUploadApi,
  abortMultipartUploadApi,
  getUploadedPartsApi,
} from "../api/upload.api";

export const useMultipartUpload = () => {
  const [progress, setProgress] = useState(0);

  const [status, setStatus] = useState("IDLE");

  const [error, setError] = useState(null);

  const [bitrateHistory, setBitrateHistory] = useState([]);


  const [isPaused, setIsPaused] = useState(false);

  const [currentUpload, setCurrentUpload] = useState(null);

  const abortControllerRef = useRef(null);

  const chunksRef = useRef([]);

  const chunkSizeRef = useRef(null);

  const completedPartsRef = useRef([]);

  const uploadMetaRef = useRef(null);
  const parallelRef = useRef(Math.min(3, MAX_PARALLEL_UPLOADS));
  const avgMbpsRef = useRef(0);

  const resolveChunkSize = (fileSize) => {
    // auto-tune chunk size based on previous upload throughput
    const lastMbps = Number(window?.localStorage?.getItem('cloud_last_upload_mbps') || 0);
    if (lastMbps >= 40) return 16 * 1024 * 1024;
    if (lastMbps >= 20) return 10 * 1024 * 1024;
    if (lastMbps >= 10) return 8 * 1024 * 1024;
    if (fileSize > 1024 * 1024 * 500) return 8 * 1024 * 1024; // large files
    return 5 * 1024 * 1024;
  };

  const startUpload = async ({ chunks, uploadId, key, fileType }) => {
    abortControllerRef.current = new AbortController();

    // Prefer server-side uploaded parts to avoid inconsistencies across sessions
    let serverUploadedParts;
    try {
      serverUploadedParts = await getUploadedPartsApi(uploadId);
    } catch (e) {
      // If the server call fails, fall back to in-memory tracking
      console.warn('[useMultipartUpload] failed to fetch uploaded parts from server, falling back to local state', e?.message || e);
      serverUploadedParts = [];
    }

    // Merge server parts with local completed parts (dedupe by PartNumber)
    const partsByNumber = new Map();
    (serverUploadedParts || []).forEach((p) => {
      if (p && p.PartNumber != null) partsByNumber.set(p.PartNumber, p);
    });
    (completedPartsRef.current || []).forEach((p) => {
      if (p && p.PartNumber != null) partsByNumber.set(p.PartNumber, p);
    });

    const mergedCompletedParts = Array.from(partsByNumber.values()).sort((a, b) => a.PartNumber - b.PartNumber);
  completedPartsRef.current = mergedCompletedParts;

    const uploadedPartNumbers = new Set(mergedCompletedParts.map((part) => part.PartNumber));
    const remainingChunks = chunks.filter((chunk) => !uploadedPartNumbers.has(chunk.partNumber));

    await uploadChunksInParallel({
      chunks: remainingChunks,

      uploadId,

      key,

      fileType,

      signal: abortControllerRef.current.signal,

      parallelism: parallelRef.current,
      maxParallelism: MAX_PARALLEL_UPLOADS,

      onThroughputSample: ({ mbps, currentParallelism, maxParallelism }) => {
        if (!mbps) return currentParallelism;
        // exponential moving average
        avgMbpsRef.current = avgMbpsRef.current
          ? avgMbpsRef.current * 0.8 + mbps * 0.2
          : mbps;

        // store history for UI
        setBitrateHistory((prev) => {
          const next = [...prev, Math.round(avgMbpsRef.current)];
          return next.slice(-25);
        });

        // adaptive parallelism: scale with bandwidth
        let nextParallel = currentParallelism;
        if (avgMbpsRef.current > 30 && currentParallelism < maxParallelism) {
          nextParallel = currentParallelism + 1;
        } else if (avgMbpsRef.current < 6 && currentParallelism > 2) {
          nextParallel = currentParallelism - 1;
        }

        parallelRef.current = nextParallel;
        try {
          window?.localStorage?.setItem('cloud_last_upload_mbps', String(Math.round(avgMbpsRef.current)));
        } catch {
          // ignore
        }
        return nextParallel;
      },

      onPartComplete: (part) => {
  completedPartsRef.current.push(part);

        const nextProgress = Math.round(
          (completedPartsRef.current.length / chunks.length) * 100,
        );

        setProgress(nextProgress);
      },
    });

    if (abortControllerRef.current.signal.aborted) {
      return;
    }

    setStatus("COMPLETING");

    await completeMultipartUploadApi({
      uploadId,

      key,

      parts: completedPartsRef.current.sort(
        (a, b) => a.PartNumber - b.PartNumber,
      ),
    });

    setProgress(100);

    setStatus("COMPLETED");
  };

  const uploadFile = async (file) => {
    try {
      setError(null);

      setProgress(0);

      setBitrateHistory([]);

      setStatus("STARTING");

      completedPartsRef.current = [];

  const chunkSize = resolveChunkSize(file.size);
  chunkSizeRef.current = chunkSize;
  const chunks = createChunks(file, chunkSize);

      chunksRef.current = chunks;

      const { uploadId, key } = await startMultipartUploadApi({
        fileName: file.name,

        fileType: file.type,

        fileSize: file.size,

        totalParts: chunks.length,
      });

      uploadMetaRef.current = {
        uploadId,
        key,
        fileType: file.type,
        chunkSize,
      };

      setCurrentUpload({
        uploadId,
        key,
        fileName: file.name,
      });

      setStatus("UPLOADING");

      await startUpload({
        chunks,

        uploadId,

        key,

        fileType: file.type,
      });
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        return;
      }

      console.error(err);

      setStatus("FAILED");

      // store the full error so UI can inspect status codes
      setError(err);
    }
  };

  const pauseUpload = () => {
    abortControllerRef.current?.abort();

    setIsPaused(true);

    setStatus("PAUSED");
  };

  const resumeUpload = async () => {
    try {
      if (!uploadMetaRef.current) {
        return;
      }

      setIsPaused(false);

      setStatus("UPLOADING");

      await startUpload({
        chunks: chunksRef.current,

        uploadId: uploadMetaRef.current.uploadId,

        key: uploadMetaRef.current.key,

        fileType: uploadMetaRef.current.fileType,
      });
    } catch (err) {
      console.error(err);

      setStatus("FAILED");

      setError(err);
    }
  };

  const cancelUpload = async () => {
    try {
      abortControllerRef.current?.abort();

      if (!uploadMetaRef.current) {
        return;
      }

      await abortMultipartUploadApi({
        uploadId: uploadMetaRef.current.uploadId,

        key: uploadMetaRef.current.key,
      });

      setStatus("CANCELLED");

      setProgress(0);

      completedPartsRef.current = [];

      chunksRef.current = [];
    } catch (err) {
      console.error(err);
    }
  };

  return {
    progress,

    status,

    error,

  uploadedParts: [],

    bitrateHistory,

    currentUpload,

    isPaused,

    uploadFile,

    pauseUpload,

    resumeUpload,

    cancelUpload,
  };
};
