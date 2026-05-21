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
  const isVideoRoute =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/video/");

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-white/10 bg-[#060B16]/95 backdrop-blur-2xl transition-transform duration-300 ease-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top Brand */}
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-sky-400/10 to-cyan-400/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <div className="absolute inset-0 bg-white/[0.03]" />
              <Cloud size={19} className="relative text-white" />
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide text-white">
                CloudDock
              </h2>
              <p className="text-[10px] tracking-wide text-white/40">
                Premium upload suite
              </p>
            </div>
          </div>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-3 px-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
            Navigation
          </p>
        </div>

        <nav className="space-y-2">
          {navItems
            .filter((item) => !item.adminOnly || role === "admin")
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    const pathMap = {
                      dashboard: "/",
                      uploads: "/uploads",
                      activity: "/activity",
                      admin: "/admin",
                      settings: "/settings",
                    };

                    const path = pathMap[item.id] || "/";

                    window.history.pushState({}, "", path);
                    window.dispatchEvent(new PopStateEvent("popstate"));

                    onNavigate(item.id);

                    if (onClose) onClose();
                  }}
                  className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-left text-[12px] font-medium tracking-[0.01em] transition-all duration-200 ${
                    isActive
                      ? "border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-sky-500/10 text-white shadow-[0_0_25px_rgba(99,102,241,0.12)]"
                      : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {/* Active Glow */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-indigo-400" />
                  )}

                  {/* Icon */}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-white/[0.03] text-white/60 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    <Icon size={15} />
                  </div>

                  {/* Label */}
                  <div className="flex items-center gap-2">
                    <span>{item.label}</span>

                    {item.id === "dashboard" && isVideoRoute && (
                      <ArrowLeft
                        size={12}
                        className="text-indigo-300/80"
                      />
                    )}
                  </div>

                  {/* Hover Dot */}
                  {!isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/0 transition group-hover:bg-white/30" />
                  )}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Footer Card */}
      <div className="border-t border-white/10 p-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-4">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />

              <p className="text-[11px] font-medium text-white">
                System Active
              </p>
            </div>

            <p className="text-[10.5px] leading-relaxed text-white/50">
              Secure cloud storage with high-speed uploads and enterprise-grade
              reliability.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
              </div>

              <span className="text-[10px] text-white/40">82%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}