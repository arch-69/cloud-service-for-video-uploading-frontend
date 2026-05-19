import {
  MAX_PARALLEL_UPLOADS,
} from "../constants/upload.constants";

import {
  uploadChunkService,
} from "../services/upload.service";

export const uploadChunksInParallel =
  async ({
    chunks,
    uploadId,
    key,
    fileType,
    onProgress,
    onPartComplete,
    onPartError,
    getIsPaused,
    waitForResume,  
    signal,
    loadChunk,
    parallelism,
    maxParallelism,
    onThroughputSample,
  }) => {

    const uploadedParts = [];

    let index = 0;

    let currentParallelism = Math.max(1, parallelism || MAX_PARALLEL_UPLOADS);
    const maxAllowed = Math.max(1, maxParallelism || MAX_PARALLEL_UPLOADS);

    const updateParallelism = (next) => {
      if (!Number.isFinite(next)) return;
      const clamped = Math.max(1, Math.min(maxAllowed, next));
      currentParallelism = clamped;
    };

    const worker = async (workerId) => {

      while (
        index < chunks.length
      ) {
        if (workerId >= currentParallelism) {
          return;
        }

        const currentIndex =
          index++;

        const currentChunk =
          chunks[currentIndex];

        if (signal?.aborted) {
          return;
        }

        if (getIsPaused?.()) {
          await waitForResume?.();
        }

        try {
          const chunkBlob =
            currentChunk.chunk
              ? currentChunk.chunk
              : await loadChunk?.(
                  currentChunk.partNumber
                );

          if (!chunkBlob) {
            throw new Error("Chunk not found");
          }

          const startTime = performance?.now?.() || Date.now();
          const uploadedPart =
            await uploadChunkService({
              chunk: chunkBlob,
              partNumber:
                currentChunk.partNumber,
              uploadId,
              key,
              fileType,
              onProgress,
              signal,
            });
          const endTime = performance?.now?.() || Date.now();
          const durationMs = Math.max(1, endTime - startTime);
          const bytes = chunkBlob.size || 0;
          const mbps = bytes ? (bytes * 8) / (durationMs * 1000) : 0;

          if (onThroughputSample) {
            const suggested = onThroughputSample({
              bytes,
              durationMs,
              mbps,
              currentParallelism,
              maxParallelism: maxAllowed,
            });
            updateParallelism(suggested);
          }

          uploadedParts.push(uploadedPart);
          onPartComplete?.(
            uploadedPart,
            currentChunk
          );

        } catch (error) {
          onPartError?.(error, currentChunk);

          if (signal?.aborted) {
            return;
          }
        }
      }
    };

    const workers = Array(
      currentParallelism
    )
      .fill(null)
      .map((_, idx) => worker(idx));

    await Promise.all(workers);

    return uploadedParts.sort(
      (a, b) =>
        a.PartNumber -
        b.PartNumber
    );
  };