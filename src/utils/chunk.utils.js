import {
  CHUNK_SIZE,
} from "../constants/upload.constants";

export const createChunks = (
  file,
  chunkSizeOverride
) => {

  const chunks = [];

  let start = 0;
  let partNumber = 1;

  const chunkSize = chunkSizeOverride || CHUNK_SIZE;

  while (start < file.size) {

    const end = Math.min(
      start + chunkSize,
      file.size
    );

    const chunk =
      file.slice(start, end);

    if (chunk.size === 0) {
      start = end;
      partNumber++;
      continue;
    }

    chunks.push({
      chunk,
      partNumber,
    });

    start = end;
    partNumber++;
  }

  return chunks;
};