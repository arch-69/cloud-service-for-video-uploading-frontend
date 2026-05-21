import { motion } from 'framer-motion';
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
} from 'recharts';
import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Database,
  Rocket,
  Users,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const kpiData = [
  {
    title: 'Active Streams',
    value: '124',
    trend: '+12.4%',
    delta: 'Up from last week',
    icon: Rocket,
    positive: true,
  },
  {
    title: 'Storage Used',
    value: '3.2 TB',
    trend: '+4.2%',
    delta: 'Projected monthly',
    icon: Database,
    positive: true,
  },
  {
    title: 'Average QoS',
    value: '98.6%',
    trend: '-0.8%',
    delta: 'Minor drop in EU',
    icon: Activity,
    positive: false,
  },
  {
    title: 'Team Seats',
    value: '24',
    trend: '+3 seats',
    delta: 'Growing usage',
    icon: Users,
    positive: true,
  },
];

const trafficData = [
  { name: 'Mon', value: 24 },
  { name: 'Tue', value: 36 },
  { name: 'Wed', value: 42 },
  { name: 'Thu', value: 38 },
  { name: 'Fri', value: 54 },
  { name: 'Sat', value: 48 },
  { name: 'Sun', value: 62 },
];

const usageData = [
  { name: 'North', value: 420 },
  { name: 'Europe', value: 310 },
  { name: 'Asia', value: 260 },
];

const bars = [
  { name: 'Jan', value: 82 },
  { name: 'Feb', value: 93 },
  { name: 'Mar', value: 104 },
  { name: 'Apr', value: 98 },
  { name: 'May', value: 110 },
];

const COLORS = ['#7C6CFF', '#4CC3FF', '#F59E0B'];

const fade = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function ModernDashboard({ user }) {
  return (
    <div className="space-y-8">
      <motion.section
        variants={fade}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-hero-gradient p-8 shadow-soft"
      >
        <div className="absolute inset-0 bg-[#0B1020]/70" />
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -right-24 top-8 h-48 w-48 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-indigo-200">
              <Sparkles size={16} /> Premium workspace insights
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              Welcome back, <span className="bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">{user?.name || 'Operator'}</span>
            </h1>
            <p className="mt-2 max-w-xl text-white/70">
              Track upload health, infrastructure stability, and team momentum in one modern command center.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Launch new upload</Button>
            <Button variant="outline" size="lg">Open analytics</Button>
          </div>
        </div>
        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
          {kpiData.map((kpi) => (
            <div key={kpi.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/70">{kpi.title}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/40 to-sky-500/40">
                  <kpi.icon size={18} className="text-white" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">{kpi.value}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                {kpi.positive ? <ArrowUpRight size={12} className="text-emerald-300" /> : <ArrowDownRight size={12} className="text-rose-300" />}
                <span className={kpi.positive ? 'text-emerald-300' : 'text-rose-300'}>{kpi.trend}</span>
                <span className="text-white/40">{kpi.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={fade} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Throughput overview</h3>
                <p className="text-sm text-white/60">Weekly traffic acceleration</p>
              </div>
              <Badge>Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="traffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C6CFF" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#7C6CFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#7C6CFF" strokeWidth={2} fill="url(#traffic)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Regional usage</h3>
            <p className="text-sm text-white/60">Share by active zones</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={usageData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              {usageData.map((zone, idx) => (
                <div key={zone.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    {zone.name}
                  </span>
                  <span>{zone.value} TB</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section variants={fade} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Monthly reliability</h3>
            <p className="text-sm text-white/60">Deployment success rate</p>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bars}>
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#4CC3FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent activity</h3>
              <Badge variant="success">Operational</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, title: 'Upload accelerated', desc: 'Adaptive multipart tuned to 12MB chunks', time: '2m ago', status: 'success' },
                { id: 2, title: 'Stream stabilized', desc: 'Latency down 8% in APAC', time: '16m ago', status: 'warning' },
                { id: 3, title: 'Billing cycle synced', desc: 'Invoice scheduled for May 24', time: '1h ago', status: 'default' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-white/50">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <Badge variant={item.status}>{item.time}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
