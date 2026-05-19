import StatCard from "../shared/StatCard";
import UploadPanel from "../upload/UploadPanel";
import UploadList from "../upload/UploadList";
import { formatBytes } from "../../utils/format.utils";

export default function UserDashboard({
  records,
  currentUpload,
  uploadControls,
  isLoading,
  onRefresh,
}) {
  const completed = records.filter(
    (record) => record.status === "COMPLETED"
  );
  const failed = records.filter(
    (record) => record.status === "FAILED" || record.status === "CANCELLED"
  );
  const inProgress = records.filter(
    (record) => record.status === "UPLOADING" || record.status === "PARTIAL"
  );
  const totalSize = completed.reduce(
    (sum, record) => sum + (record.fileSize || 0),
    0
  );
  const largestFile = completed.reduce(
    (max, record) => Math.max(max, record.fileSize || 0),
    0
  );
  const avgFileSize = completed.length
    ? totalSize / completed.length
    : 0;
  const totalUploads = records.length;
  const successRate = totalUploads
    ? Math.round((completed.length / totalUploads) * 100)
    : 0;

  // simple 7-day upload trend
  const today = new Date();
  const trend = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - idx));
    const dayKey = day.toISOString().slice(0, 10);
    const count = records.filter((record) => {
      const ts = record.updatedAt || record.startedAt;
      if (!ts) return false;
      return new Date(ts).toISOString().slice(0, 10) === dayKey;
    }).length;
    return {
      label: day.toLocaleDateString(undefined, { weekday: "short" }),
      count,
    };
  });
  const maxTrend = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div className="dashboard-grid">
      <div className="stat-grid">
        <StatCard
          label="Total uploads"
          value={totalUploads}
          hint="All time"
          trend={{ type: "positive", text: `+${completed.length}` }}
        />
        <StatCard
          label="Successful uploads"
          value={completed.length}
          hint={`Success rate ${successRate}%`}
          trend={{ type: "positive", text: `+${completed.length}` }}
        />
        <StatCard
          label="In progress"
          value={inProgress.length}
          hint="Active uploads"
          trend={{ type: "warning", text: "Live" }}
        />
        <StatCard
          label="Failed uploads"
          value={failed.length}
          hint="Requires review"
          trend={{ type: "negative", text: "-" }}
        />
        <StatCard
          label="Storage used"
          value={formatBytes(totalSize)}
          hint="Encrypted at rest"
        />
        <StatCard
          label="Avg file size"
          value={formatBytes(avgFileSize)}
          hint="Per completed upload"
        />
        <StatCard
          label="Largest file"
          value={formatBytes(largestFile)}
          hint="Top upload"
        />
      </div>

      <UploadPanel {...uploadControls} currentUpload={currentUpload} />

      <div className="card chart-card">
        <div>
          <h3>Usage trends</h3>
          <p className="muted small">Uploads in the last 7 days</p>
        </div>
        <div className="chart-bars">
          {trend.map((item) => (
            <div key={item.label} className="chart-bar">
              <div
                className="chart-bar__fill"
                style={{ height: `${(item.count / maxTrend) * 100}%` }}
              />
              <span className="muted small">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="metric-grid">
          <div>
            <p className="muted small">Success rate</p>
            <strong>{successRate}%</strong>
          </div>
          <div>
            <p className="muted small">Active uploads</p>
            <strong>{inProgress.length}</strong>
          </div>
          <div>
            <p className="muted small">Bandwidth used</p>
            <strong>{formatBytes(totalSize)}</strong>
          </div>
        </div>
      </div>

      <div className="card dashboard-header">
        <div>
          <h3>Upload activity</h3>
          <p className="muted small">
            Synced from your profile history.
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <UploadList records={records} title="Your uploads" />

    </div>
  );
}
