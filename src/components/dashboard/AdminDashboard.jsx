import { useEffect, useMemo, useState } from "react";

import {
  ShieldCheck,
  Activity,
  RefreshCcw,
  Server,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import StatCard from "../shared/StatCard";
import ActivityFeed from "../shared/ActivityFeed";
import UploadList from "../upload/UploadList";

import { formatBytes } from "../../utils/format.utils";

import {
  blockServiceApi,
  getAllServicesApi,
  getServiceTypesApi,
} from "../../api/admin.api";

export default function AdminDashboard({
  records,
  activities,
  users,
}) {
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
    <div className="space-y-4 sm:space-y-6">
      {/* Top Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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

      {/* Insights + Services */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[320px_1fr]">
        {/* Traffic Insights */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 p-5 backdrop-blur-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Activity
                  size={16}
                  className="text-indigo-300"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Traffic Insights
                </h3>

                <p className="text-[10.5px] text-white/40">
                  System performance overview
                </p>
              </div>
            </div>

            <p className="text-[10.5px] leading-relaxed text-white/50">
              Peak usage detected between 1PM – 4PM.
              Average upload latency remains stable with
              optimized multipart delivery.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  label: "Latency",
                  value: "120ms",
                },
                {
                  label: "Failure Rate",
                  value: "2.1%",
                },
                {
                  label: "Encrypted Objects",
                  value: "100%",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <span className="text-[10.5px] text-white/45">
                    {item.label}
                  </span>

                  <span className="text-[11px] font-semibold text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Control */}

        {/* Service Control */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 p-4 sm:p-5 backdrop-blur-2xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

          {/* Header */}
          <div className="relative flex flex-col gap-4 border-b border-white/10 pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  className="text-emerald-300"
                />

                <h3 className="text-sm font-semibold text-white sm:text-base">
                  Service Control Center
                </h3>
              </div>

              <p className="mt-1 text-[11px] leading-relaxed text-white/40 sm:text-[12px]">
                Monitor, block, and manage backend services
                in real time.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[12px] text-white/70 outline-none transition focus:border-indigo-500/30 sm:w-auto"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value)
                }
              >
                <option value="ALL">All services</option>

                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={refreshServices}
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[12px] font-medium text-white transition hover:bg-white/[0.06] disabled:opacity-50 sm:w-auto"
              >
                <RefreshCcw
                  size={13}
                  className={isLoading ? "animate-spin" : ""}
                />

                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-[11px] text-red-200">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          {/* Desktop Table */}
          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
            {/* Header */}
            <div className="grid grid-cols-[1.3fr_1fr_1fr_140px] border-b border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-white/35">
              <span>Service</span>
              <span>Type</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {filteredServices.map((service) => {
                const id =
                  service?._id || service?.id;

                const isBlocked =
                  !!service?.isBlocked;

                return (
                  <div
                    key={id}
                    className="grid grid-cols-[1.3fr_1fr_1fr_140px] items-center px-5 py-4 transition hover:bg-white/[0.025]"
                  >
                    {/* Service */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                        <Server
                          size={16}
                          className="text-white/60"
                        />
                      </div>

                      <div>
                        <p className="text-[12px] font-medium text-white">
                          {service?.service ||
                            service?.name ||
                            "Unnamed"}
                        </p>

                        <span className="text-[10px] text-white/35">
                          Service instance
                        </span>
                      </div>
                    </div>

                    {/* Type */}
                    <span className="text-[11px] text-white/50">
                      {service?.service || "UNKNOWN"}
                    </span>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium ${isBlocked
                            ? "border-red-500/20 bg-red-500/10 text-red-200"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                          }`}
                      >
                        {isBlocked
                          ? "Blocked"
                          : "Active"}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          if (!id) return;

                          await blockServiceApi(
                            id,
                            !isBlocked
                          );

                          refreshServices();
                        }}
                        className={`rounded-xl px-4 py-2 text-[11px] font-medium transition ${isBlocked
                            ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                            : "border border-red-500/20 bg-red-500/[0.06] text-red-200 hover:bg-red-500/[0.12]"
                          }`}
                      >
                        {isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="mt-5 grid gap-4 lg:hidden">
            {filteredServices.map((service) => {
              const id =
                service?._id || service?.id;

              const isBlocked =
                !!service?.isBlocked;

              return (
                <div
                  key={id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                        <Server
                          size={18}
                          className="text-white/60"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-medium text-white">
                          {service?.service ||
                            service?.name ||
                            "Unnamed"}
                        </h4>

                        <p className="mt-1 text-[11px] text-white/40">
                          Service instance
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-medium ${isBlocked
                          ? "border-red-500/20 bg-red-500/10 text-red-200"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                        }`}
                    >
                      {isBlocked
                        ? "Blocked"
                        : "Active"}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-black/20 p-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-white/30">
                        Type
                      </p>

                      <p className="mt-1 text-[12px] text-white/70">
                        {service?.service ||
                          "UNKNOWN"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-white/30">
                        Status
                      </p>

                      <p className="mt-1 text-[12px] text-white/70">
                        {isBlocked
                          ? "Currently blocked"
                          : "Running normally"}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={async () => {
                      if (!id) return;

                      await blockServiceApi(
                        id,
                        !isBlocked
                      );

                      refreshServices();
                    }}
                    className={`mt-4 flex h-11 w-full items-center justify-center rounded-2xl text-[12px] font-medium transition ${isBlocked
                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                        : "border border-red-500/20 bg-red-500/[0.06] text-red-200 hover:bg-red-500/[0.12]"
                      }`}
                  >
                    {isBlocked
                      ? "Unblock Service"
                      : "Block Service"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>


      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <UploadList
          records={records}
          title="All Uploads"
        />

        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}