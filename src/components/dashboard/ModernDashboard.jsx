import { motion } from "framer-motion";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Database,
  Rocket,
  Users,
} from "lucide-react";

import { Card, CardHeader, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const kpiData = [
  {
    title: "Active Streams",
    value: "124",
    trend: "+12.4%",
    delta: "Up from last week",
    icon: Rocket,
    positive: true,
  },
  {
    title: "Storage Used",
    value: "3.2 TB",
    trend: "+4.2%",
    delta: "Projected monthly",
    icon: Database,
    positive: true,
  },
  {
    title: "Average QoS",
    value: "98.6%",
    trend: "-0.8%",
    delta: "Minor drop in EU",
    icon: Activity,
    positive: false,
  },
  {
    title: "Team Seats",
    value: "24",
    trend: "+3 seats",
    delta: "Growing usage",
    icon: Users,
    positive: true,
  },
];

const trafficData = [
  { name: "Mon", value: 24 },
  { name: "Tue", value: 36 },
  { name: "Wed", value: 42 },
  { name: "Thu", value: 38 },
  { name: "Fri", value: 54 },
  { name: "Sat", value: 48 },
  { name: "Sun", value: 62 },
];

const usageData = [
  { name: "North", value: 420 },
  { name: "Europe", value: 310 },
  { name: "Asia", value: 260 },
];

const bars = [
  { name: "Jan", value: 82 },
  { name: "Feb", value: 93 },
  { name: "Mar", value: 104 },
  { name: "Apr", value: 98 },
  { name: "May", value: 110 },
];

const COLORS = ["#7C6CFF", "#4CC3FF", "#F59E0B"];

const fade = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const tooltipStyle = {
  background: "#0F172A",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  color: "#fff",
  fontSize: "11px",
};

export default function ModernDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 p-6 backdrop-blur-2xl"
      >
        {/* Glow */}
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 text-[10.5px] font-medium tracking-wide text-indigo-200">
              <Sparkles size={13} />
              Premium workspace insights
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-white md:text-[34px]">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                {user?.name || "Operator"}
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-[11px] leading-relaxed text-white/50">
              Track upload health, infrastructure stability,
              and team momentum through a clean modern
              control center.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button className="h-10 rounded-2xl bg-white px-5 text-[11px] font-medium text-black hover:bg-white/90">
              Launch Upload
            </Button>

            <Button
              variant="outline"
              className="h-10 rounded-2xl border-white/10 bg-white/[0.03] px-5 text-[11px] text-white hover:bg-white/[0.05]"
            >
              Open Analytics
            </Button>
          </div>
        </div>

        {/* KPI */}
        <div className="relative z-10 mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiData.map((kpi) => (
            <div
              key={kpi.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    {kpi.title}
                  </p>

                  <h3 className="mt-3 text-[24px] font-semibold tracking-tight text-white">
                    {kpi.value}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10">
                  <kpi.icon
                    size={17}
                    className="text-white"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[10px]">
                {kpi.positive ? (
                  <ArrowUpRight
                    size={12}
                    className="text-emerald-300"
                  />
                ) : (
                  <ArrowDownRight
                    size={12}
                    className="text-red-300"
                  />
                )}

                <span
                  className={
                    kpi.positive
                      ? "text-emerald-300"
                      : "text-red-300"
                  }
                >
                  {kpi.trend}
                </span>

                <span className="text-white/35">
                  {kpi.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Charts */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="visible"
        className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]"
      >
        {/* Throughput */}
        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 backdrop-blur-2xl">
          <CardHeader className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-semibold text-white">
                  Throughput Overview
                </h3>

                <p className="mt-1 text-[10px] text-white/40">
                  Weekly traffic acceleration
                </p>
              </div>

              <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-200">
                Live
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient
                      id="traffic"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7C6CFF"
                        stopOpacity={0.45}
                      />

                      <stop
                        offset="100%"
                        stopColor="#7C6CFF"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7C6CFF"
                    strokeWidth={2}
                    fill="url(#traffic)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Regional Usage */}
        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 backdrop-blur-2xl">
          <CardHeader className="border-b border-white/10 px-5 py-4">
            <h3 className="text-[13px] font-semibold text-white">
              Regional Usage
            </h3>

            <p className="text-[10px] text-white/40">
              Active traffic by region
            </p>
          </CardHeader>

          <CardContent className="p-5">
            <div className="h-60">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={usageData}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                  >
                    {usageData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 space-y-3">
              {usageData.map((zone, idx) => (
                <div
                  key={zone.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: COLORS[idx],
                      }}
                    />

                    <span className="text-[10.5px] text-white/65">
                      {zone.name}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-white">
                    {zone.value} TB
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Bottom */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="visible"
        className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
      >
        {/* Reliability */}
        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 backdrop-blur-2xl">
          <CardHeader className="border-b border-white/10 px-5 py-4">
            <h3 className="text-[13px] font-semibold text-white">
              Monthly Reliability
            </h3>

            <p className="text-[10px] text-white/40">
              Deployment success rate
            </p>
          </CardHeader>

          <CardContent className="p-5">
            <div className="h-60">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={bars}>
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    fill="#4CC3FF"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 backdrop-blur-2xl">
          <CardHeader className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-semibold text-white">
                  Recent Activity
                </h3>

                <p className="mt-1 text-[10px] text-white/40">
                  Infrastructure and system updates
                </p>
              </div>

              <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-200">
                Operational
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-5">
            {[
              {
                id: 1,
                title: "Upload accelerated",
                desc: "Adaptive multipart tuned to 12MB chunks",
                time: "2m ago",
              },
              {
                id: 2,
                title: "Stream stabilized",
                desc: "Latency reduced 8% in APAC",
                time: "16m ago",
              },
              {
                id: 3,
                title: "Billing cycle synced",
                desc: "Invoice scheduled for May 24",
                time: "1h ago",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.05]"
              >
                <div>
                  <h4 className="text-[11px] font-medium text-white">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-[10px] text-white/40">
                    {item.desc}
                  </p>
                </div>

                <Badge className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] text-white/50">
                  {item.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}