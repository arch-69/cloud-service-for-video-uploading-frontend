import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  BarChart3,
  Rocket,
  Crown,
  RefreshCcw,
  UploadCloud,
} from "lucide-react";

import StatCard from "../shared/StatCard";
import UploadPanel from "../upload/UploadPanel";
import UploadList from "../upload/UploadList";

import {
  capitalize,
  formatBytes,
  formatDateTime,
} from "../../utils/format.utils";

export default function UserDashboard({
  records,
  currentUpload,
  uploadControls,
  isLoading,
  onRefresh,
  currentPlan,
  planLoading,
  planError,
}) {
  const completed = records.filter(
    (record) => record.status === "COMPLETED"
  );

  const failed = records.filter(
    (record) =>
      record.status === "FAILED" ||
      record.status === "CANCELLED"
  );

  const inProgress = records.filter(
    (record) =>
      record.status === "UPLOADING" ||
      record.status === "PARTIAL"
  );

  const totalSize = completed.reduce(
    (sum, record) => sum + (record.fileSize || 0),
    0
  );

  const largestFile = completed.reduce(
    (max, record) =>
      Math.max(max, record.fileSize || 0),
    0
  );

  const avgFileSize = completed.length
    ? totalSize / completed.length
    : 0;

  const totalUploads = records.length;

  const successRate = totalUploads
    ? Math.round(
        (completed.length / totalUploads) * 100
      )
    : 0;

  /* Trend */
  const today = new Date();

  const trend = Array.from({ length: 7 }).map(
    (_, idx) => {
      const day = new Date(today);

      day.setDate(today.getDate() - (6 - idx));

      const dayKey = day
        .toISOString()
        .slice(0, 10);

      const count = records.filter((record) => {
        const ts =
          record.updatedAt || record.startedAt;

        if (!ts) return false;

        return (
          new Date(ts)
            .toISOString()
            .slice(0, 10) === dayKey
        );
      }).length;

      return {
        label: day.toLocaleDateString(undefined, {
          weekday: "short",
        }),
        count,
      };
    }
  );

  const maxTrend = Math.max(
    ...trend.map((t) => t.count),
    1
  );

  /* Plan */
  const planName = currentPlan?.plan?.name
    ? capitalize(currentPlan.plan.name)
    : "No plan";

  const planStatus =
    currentPlan?.status || "INACTIVE";

  const isActivePlan =
    planStatus === "ACTIVE" ||
    planStatus === "TRIALING";

  const storageLimit =
    currentPlan?.plan?.storageLimit ?? 0;

  const bandwidthLimit =
    currentPlan?.plan?.bandwidthLimit ?? 0;

  const maxFileSize =
    currentPlan?.plan?.maxFileSize ?? 0;

  const monthlyPrice =
    currentPlan?.plan?.monthlyPrice ?? 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <StatCard
          label="Total uploads"
          value={totalUploads}
          hint="All time"
          trend={{
            type: "positive",
            text: `+${completed.length}`,
          }}
        />

        <StatCard
          label="Successful"
          value={completed.length}
          hint={`Success rate ${successRate}%`}
          trend={{
            type: "positive",
            text: `${successRate}%`,
          }}
        />

        <StatCard
          label="In Progress"
          value={inProgress.length}
          hint="Active uploads"
          trend={{
            type: "warning",
            text: "Live",
          }}
        />

        <StatCard
          label="Failed"
          value={failed.length}
          hint="Needs review"
          trend={{
            type: "negative",
            text: `${failed.length}`,
          }}
        />

        <StatCard
          label="Storage Used"
          value={formatBytes(totalSize)}
          hint="Encrypted at rest"
        />

        <StatCard
          label="Avg File Size"
          value={formatBytes(avgFileSize)}
          hint="Per completed upload"
        />

        <StatCard
          label="Largest File"
          value={formatBytes(largestFile)}
          hint="Top upload"
        />
      </div>

      {/* Top Section */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Upload Panel */}
        <UploadPanel
          {...uploadControls}
          currentUpload={currentUpload}
        />

        {/* Subscription */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 p-5 backdrop-blur-2xl">
          {/* Glow */}
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Crown
                  size={15}
                  className="text-amber-300"
                />

                <h3 className="text-sm font-semibold text-white">
                  Current Subscription
                </h3>
              </div>

              <p className="mt-1 text-[10.5px] text-white/40">
                Your active storage and bandwidth plan.
              </p>
            </div>

            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-medium ${
                isActivePlan
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                  : "border-red-500/20 bg-red-500/10 text-red-200"
              }`}
            >
              {isActivePlan
                ? "Active"
                : "Inactive"}
            </span>
          </div>

          {/* Loading */}
          {planLoading && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-[11px] text-white/50">
              Loading plan details...
            </div>
          )}

          {/* Error */}
          {planError && (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-4 py-5 text-[11px] text-red-200">
              {planError}
            </div>
          )}

          {/* Plan */}
          {currentPlan && (
            <div className="relative mt-5">
              <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                  Plan
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <h4 className="text-[20px] font-semibold text-white">
                    {planName}
                  </h4>

                  <span className="text-[12px] font-semibold text-amber-300">
                    ₹{monthlyPrice}
                    <span className="text-[10px] text-white/35">
                      /mo
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Storage Limit",
                    value: `${storageLimit} GB`,
                    icon: HardDrive,
                  },
                  {
                    label: "Bandwidth",
                    value: `${bandwidthLimit} GB`,
                    icon: Activity,
                  },
                  {
                    label: "Max File Size",
                    value: `${maxFileSize} MB`,
                    icon: UploadCloud,
                  },
                  {
                    label: "Success Rate",
                    value: `${successRate}%`,
                    icon: CheckCircle2,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                        {item.label}
                      </p>

                      <item.icon
                        size={14}
                        className="text-white/40"
                      />
                    </div>

                    <h4 className="mt-3 text-[14px] font-semibold text-white">
                      {item.value}
                    </h4>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Started
                  </p>

                  <h4 className="mt-2 text-[11px] font-medium text-white">
                    {formatDateTime(
                      currentPlan.startedAt
                    )}
                  </h4>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Expires
                  </p>

                  <h4 className="mt-2 text-[11px] font-medium text-white">
                    {formatDateTime(
                      currentPlan.expiresAt
                    )}
                  </h4>
                </div>
              </div>
            </div>
          )}

          {/* Empty */}
          {!currentPlan && !planLoading && (
            <div className="relative mt-5 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Rocket
                  size={20}
                  className="text-white/35"
                />
              </div>

              <h4 className="text-[12px] font-medium text-white">
                No active subscription
              </h4>

              <p className="mt-2 max-w-xs text-[10.5px] leading-relaxed text-white/40">
                Upgrade your workspace to unlock
                faster uploads and larger storage.
              </p>

              <button
                className="mt-5 rounded-2xl bg-white px-5 py-2.5 text-[11px] font-medium text-black transition hover:bg-white/90"
                onClick={() => {
                  window.history.pushState(
                    {},
                    "",
                    "/pricing"
                  );

                  window.dispatchEvent(
                    new PopStateEvent("popstate")
                  );
                }}
              >
                Choose a Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Analytics */}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Usage Trends */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 p-5 backdrop-blur-2xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3
                  size={15}
                  className="text-cyan-300"
                />

                <h3 className="text-sm font-semibold text-white">
                  Usage Trends
                </h3>
              </div>

              <p className="mt-1 text-[10.5px] text-white/40">
                Upload activity over the last 7 days.
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="relative mt-8 flex h-48 items-end justify-between gap-3">
            {trend.map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-3"
              >
                <div className="flex h-40 w-full items-end">
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-indigo-500 to-cyan-400 transition-all duration-300"
                    style={{
                      height: `${
                        (item.count / maxTrend) * 100
                      }%`,
                      minHeight:
                        item.count > 0
                          ? "10%"
                          : "4%",
                    }}
                  />
                </div>

                <span className="text-[10px] text-white/40">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="relative mt-6 grid grid-cols-3 gap-3">
            {[
              {
                label: "Success Rate",
                value: `${successRate}%`,
              },
              {
                label: "Active Uploads",
                value: inProgress.length,
              },
              {
                label: "Bandwidth Used",
                value: formatBytes(totalSize),
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                  {metric.label}
                </p>

                <h4 className="mt-2 text-[13px] font-semibold text-white">
                  {metric.value}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Activity */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#060B16]/95 px-5 py-4 backdrop-blur-2xl">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Upload Activity
              </h3>

              <p className="mt-1 text-[10.5px] text-white/40">
                Synced from your upload history.
              </p>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[11px] font-medium text-white transition hover:bg-white/[0.06] disabled:opacity-50"
            >
              <RefreshCcw
                size={13}
                className={
                  isLoading ? "animate-spin" : ""
                }
              />

              {isLoading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          {/* Upload List */}
          <UploadList
            records={records}
            title="Your Uploads"
          />
        </div>
      </div>
    </div>
  );
}