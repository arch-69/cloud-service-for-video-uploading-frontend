import { Bell, Moon, Sun, Search, Menu, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header({ user, onLogout, theme, onToggleTheme, onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-white/10 bg-[#0B1020]/80 px-6 py-5 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 lg:hidden" onClick={onOpenSidebar}>
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Dashboard</p>
            <h2 className="text-xl font-semibold text-white">Welcome back, {user.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 md:flex">
            <Search size={14} />
            <input className="bg-transparent text-sm text-white/70 placeholder:text-white/40 focus:outline-none" placeholder="Search or press ⌘K" />
          </div>
          <Button variant="outline" size="sm">
            <Plus size={14} /> New Upload
          </Button>
          <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70">
            <Bell size={16} />
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70" onClick={onToggleTheme}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/40 to-sky-400/40 text-white">
                  {user.pfp ? (
                    <img src={user.pfp} alt={`${user.name} avatar`} className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    user.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="hidden flex-col text-left md:flex">
                  <span className="text-sm font-medium text-white">{user.name}</span>
                  <span className="text-xs text-white/40">{user.role}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Workspace settings</DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout} className="text-rose-200">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
