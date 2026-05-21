import {
  Cloud,
  UploadCloud,
  LayoutDashboard,
  ShieldCheck,
  Activity,
  Settings,
  ArrowLeft,
  X,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "uploads", label: "Uploads", icon: UploadCloud },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  activeView,
  onNavigate,
  role,
  isOpen,
  onClose,
}) {
  const isVideoRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/video/');
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-[#0B1020]/95 backdrop-blur-xl border-r border-white/10 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/40 to-sky-400/40 text-white shadow-glow">
            <Cloud size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">CloudDock</p>
            <span className="text-xs text-white/50">Premium upload suite</span>
          </div>
        </div>
        <button className="text-white/70 lg:hidden" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>

      <nav className="space-y-3 px-5">
        {navItems
          .filter((item) => !item.adminOnly || role === "admin")
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${isActive ? 'bg-white/10 text-white shadow-glow' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                onClick={() => {
                  const pathMap = {
                    dashboard: '/',
                    uploads: '/uploads',
                    activity: '/activity',
                    admin: '/admin',
                    settings: '/settings',
                  };
                  const path = pathMap[item.id] || '/';
                  window.history.pushState({}, '', path);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  onNavigate(item.id);
                  if (onClose) onClose();
                }}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-indigo-500/30 text-white' : 'bg-white/5 text-white/60 group-hover:text-white'}`}>
                  <Icon size={18} />
                </span>
                <span className="flex items-center gap-2">
                  {item.label}
                  {item.id === 'dashboard' && isVideoRoute && (
                    <ArrowLeft size={14} className="text-white/50" />
                  )}
                </span>
              </button>
            );
          })}
      </nav>

      <div className="mt-auto px-6 pb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
          <div className="mb-2 flex items-center gap-2 text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live status
          </div>
          Secure • Fast • Reliable
        </div>
      </div>
    </aside>
  );
}
