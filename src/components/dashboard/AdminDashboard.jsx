import { useEffect, useMemo, useState } from "react";
import StatCard from "../shared/StatCard";
import ActivityFeed from "../shared/ActivityFeed";
import UploadList from "../upload/UploadList";
import { formatBytes } from "../../utils/format.utils";
import {
  blockServiceApi,
  getAllServicesApi,
  getServiceTypesApi,
} from "../../api/admin.api";

export default function AdminDashboard({ records, activities, users }) {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [selectedType, setSelectedType] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalUploads = records.length;
  const completed = records.filter(
    (record) => record.status === "COMPLETED"
  );
  const totalTraffic = records.reduce(
    (sum, record) => sum + (record.fileSize || 0),
    0
  );

  const successRate = totalUploads
    ? Math.round((completed.length / totalUploads) * 100)
    : 0;

  const filteredServices = useMemo(() => {
    if (!allServices?.length) return [];
    if (selectedType === "ALL") return allServices;
    return allServices.filter(
      (service) => service?.service === selectedType
    );
  }, [allServices, selectedType]);

  const refreshServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [typesRes, allRes] = await Promise.all([
        getServiceTypesApi(),
        getAllServicesApi(),
      ]);

      if (typesRes?.success) {
        setServiceTypes(typesRes.data || []);
      }
      if (allRes?.success) {
        setAllServices(allRes.data || []);
      }
    } catch (err) {
      setError(err?.message || "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshServices();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-grid">
      <div className="stat-grid">
        <StatCard
          label="Active users"
          value={users.length}
          hint="All accounts"
          trend={{ type: "positive", text: "+4" }}
        />
        <StatCard
          label="Total uploads"
          value={totalUploads}
          hint={`Success rate ${successRate}%`}
        />
        <StatCard
          label="Traffic volume"
          value={formatBytes(totalTraffic)}
          hint="Last 7 days"
        />
      </div>

      <div className="card insights">
        <h3>Traffic insights</h3>
        <p className="muted">
          Peak usage today between 1pm - 4pm. Average upload time
          12s, median chunk size 5MB.
        </p>
        <div className="insight-grid">
          <div>
            <p className="muted small">Latency</p>
            <strong>120ms</strong>
          </div>
          <div>
            <p className="muted small">Failure rate</p>
            <strong>2.1%</strong>
          </div>
          <div>
            <p className="muted small">Encrypted objects</p>
            <strong>100%</strong>
          </div>
        </div>
      </div>

      <div className="card admin-services admin-services--top">
        <div className="admin-services__header">
          <div>
            <h3>Service control center</h3>
            <p className="muted small">
              Block/unblock services in real time.
            </p>
          </div>
          <div className="admin-services__actions">
            <select
              className="service-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="ALL">All services</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              type="button"
              className="secondary-button"
              onClick={refreshServices}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ borderLeft: "4px solid #ef4444", marginTop: 12 }}>
            {error}
          </div>
        )}

        <div className="service-table">
          <div className="service-row service-row--head">
            <span>Service</span>
            <span>Type</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredServices.length ? (
            filteredServices.map((service) => {
              const id = service?._id || service?.id;
              const isBlocked = !!service?.isBlocked;
              return (
                <div key={id} className="service-row">
                  <span>{service?.service || service?.name || "Unnamed"}</span>
                  <span className="muted small">{service?.service || "UNKNOWN"}</span>
                  <span className={`status-pill ${isBlocked ? "FAILED" : ""}`}>
                    {isBlocked ? "Blocked" : "Active"}
                  </span>
                  <div>
                    <button
                      className={isBlocked ? "secondary-button" : "ghost-button danger"}
                      onClick={async () => {
                        if (!id) return;
                        await blockServiceApi(id, !isBlocked);
                        refreshServices();
                      }}
                    >
                      {isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="muted" style={{ marginTop: 12 }}>
              No services available.
            </p>
          )}
        </div>
      </div>

      <UploadList records={records} title="All uploads" />
      <ActivityFeed activities={activities} />
    </div>
  );
}
