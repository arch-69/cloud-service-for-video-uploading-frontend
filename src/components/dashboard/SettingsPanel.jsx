import {
  ShieldCheck,
  Mail,
  User2,
  LockKeyhole,
  ChevronRight,
} from "lucide-react";

export default function SettingsPanel({ user }) {
  const settings = [
    {
      label: "Account",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Role",
      value: user.role,
      icon: User2,
    },
    {
      label: "Security",
      value: "2FA enforced",
      icon: LockKeyhole,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060B16]/95 p-5 backdrop-blur-2xl">
      {/* Glow */}
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-start justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={15}
              className="text-indigo-300"
            />

            <h3 className="text-sm font-semibold text-white">
              Workspace Settings
            </h3>
          </div>

          <p className="mt-1 text-[10.5px] text-white/40">
            Manage account preferences and workspace
            security.
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="relative mt-5 grid gap-3 md:grid-cols-3">
        {settings.map((item) => (
          <div
            key={item.label}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
          >
            <div className="flex items-start justify-between">
              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-cyan-500/10">
                <item.icon
                  size={16}
                  className="text-white/80"
                />
              </div>

              <ChevronRight
                size={14}
                className="text-white/20 transition group-hover:text-white/40"
              />
            </div>

            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                {item.label}
              </p>

              <h4 className="mt-2 truncate text-[11.5px] font-medium text-white">
                {item.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
            Workspace Status
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />

            <span className="text-[11px] font-medium text-white">
              Secure & Operational
            </span>
          </div>
        </div>

        <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-[10.5px] font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white">
          Manage
        </button>
      </div>
    </div>
  );
}