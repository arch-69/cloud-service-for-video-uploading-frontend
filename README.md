# CloudDock Frontend — README

This repository is a production-style React frontend for a cloud upload and video streaming platform called CloudDock. It demonstrates a premium SaaS dashboard, multipart uploads to S3, streaming playback, analytics, and admin controls.

This README explains the app flow, complex components, responsive behavior, component relationships, and how to extend the frontend.

---

## High-level architecture

- React (Vite) single-page app
- Centralized UI layout (Sidebar + Header + Main)
- API layer in `src/api/*` using a shared `httpClient` that handles auth, retries and global service-block events
- Upload engine (client-side chunking + parallel upload) in `src/hooks/useMultipartUpload.js` and `src/utils/*`
- Lightweight SPA routing using `history.pushState` and `popstate` events

---

## App flow

1. User signs in (handled externally or via `Auth` components). Tokens are stored in localStorage and attached to `httpClient`.
2. The main layout (`App.jsx`) renders `Sidebar` (navigation), `Header` (search, quick actions, theme toggle), and the selected view.
3. `UserDashboard` (Overview) shows high-level stats only — no uploads or activity widgets. Uploads live in `/uploads`.
4. Uploads: user selects a file → `useMultipartUpload` splits the file into chunks → `uploadChunksInParallel` uploads parts with adaptive parallelism → `completeMultipartUploadApi` finalizes.
5. Streaming: `VideoPlayer` fetches signed URLs and renders supported sources. `.mkv` is not supported natively — convert or stream via HLS.
6. Admin: toggling services triggers server calls; frontend listens for service-block events via `httpClient`.

---

## Key components and responsibilities

### Layout
- `App.jsx`: global layout, theme, global event listeners (service alerts)
- `Sidebar.jsx`: navigation and responsive drawer
- `Header.jsx`: search/command bar, notifications, quick actions

### Dashboard
- `UserDashboard.jsx`: overview-only stats grid (primary + secondary stat cards)
- `StatCard.jsx`: compact reusable stat UI (supports variants via `className`)

### Uploads
- `UploadPanel.jsx`: dedicated upload page/UI (drag/drop, queue management)
- `useMultipartUpload.js`: manages chunking, resume, parallel uploads, and completion
- `upload.service.js` + `upload.api.js`: get signed URLs and complete uploads

### Utils & Hooks
- `chunk.utils.js`: chunking logic (supports override chunk sizes)
- `parallelUpload.utils.js`: adaptive parallel uploads and throughput sampling
- `retry.utils.js`: retry wrapper for idempotent requests

---

## Complex component: `useMultipartUpload`

Purpose: perform a robust multipart upload from the browser to S3 with resumability and adaptive performance.

Key responsibilities:
- Create chunks (auto‑tune chunk size using previous transfer speed).
- Start multipart upload session on server (startMultipartUploadApi).
- Upload chunks in parallel using pre-signed URLs (uploadChunksInParallel); retry failed chunks.
- Track completed parts locally (in-memory) and rely on server for authoritative part lists when resuming.
- Complete the multipart upload with the server once all parts finish.

Important design notes:
- We no longer call `saveUploadedPartApi` per part to improve throughput.
- `upload.service.uploadChunkService` reports ETag and PartNumber and relies on `completeMultipartUploadApi` for finalization.
- Chunk size is persisted in the upload session to ensure resume works even with dynamic sizing.

---

## Responsive behavior & design system

- Desktop (>= 1280px): 12-column grid, sidebar visible (280px). Main content uses remaining width with asymmetrical layout for hero sections.
- Tablet (768px–1279px): Sidebar collapses into a compact top bar with hamburger. Cards reflow into 2–3 columns.
- Mobile (< 768px): Stack cards vertically, simplified header, and a full-screen drawer for navigation.

Spacing scale (CSS variables):
- base spacing: 8px
- small: 8px
- base: 16px
- large: 24px
- xl: 32px

Theme variables live in `src/index.css`. Use `data-theme="light"` to switch to light palette.

---

## Component relations & hierarchy (important connections)

- `App.jsx` mounts `Sidebar`, `Header`, and the current view.
- `Sidebar` dispatches navigation via `history.pushState` and `popstate`.
- Views call API helpers in `src/api/*` which use `httpClient` (common token + interceptor behavior).
- `useMultipartUpload` coordinates `chunk.utils` and `parallelUpload.utils` and exposes simple methods: `uploadFile`, `pauseUpload`, `resumeUpload`, `cancelUpload`.

---
http://loca/host:3200/api/v1/razorpay/get-current-plan
## File organization

Important files:
- `src/hooks/useMultipartUpload.js` — upload lifecycle
- `src/utils/parallelUpload.utils.js` — concurrency + throughput sampling
- `src/utils/chunk.utils.js` — chunk creation (overrideable)
- `src/services/upload.service.js` — upload to presigned URL
- `src/api/upload.api.js` — start/complete/abort endpoints
- `src/components/dashboard/UserDashboard.jsx` — overview stats

---

## How to run (dev)

1. Install dependencies
```
npm install
```
2. Start dev server
```
npm run dev
```
3. Build
```
npm run build
```

---

## Extending the design

- Add Framer Motion transitions for hero analytics and stat counters.
- Replace static SVG sparklines with small `recharts` or `visx` components for interactions.
- Add server-sent events (SSE) or WebSocket feed for true live metrics.

---

If you want, I can also generate:
- A full design system README (tokens, spacing, components)
- A style guide page with component previews
- Example pages: Uploads, Video player, Analytics pages

Tell me which documentation or components to expand next.
