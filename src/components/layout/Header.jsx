import {
  Bell,
  Moon,
  Sun,
  Search,
  Menu,
  Plus,
  ChevronDown,
} from "lucide-react";

import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header({
  user,
  onLogout,
  theme,
  onToggleTheme,
  onOpenSidebar,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060B16]/80 backdrop-blur-2xl">
      <div className="flex h-[68px] items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
            onClick={onOpenSidebar}
          >
            <Menu size={16} />
          </button>

          {/* Heading */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Dashboard
            </span>

            <h2 className="text-[15px] font-semibold tracking-[0.01em] text-white">
              Welcome back, {user.name}
            </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              placeholder="Search..."
              className="h-10 w-52 rounded-2xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-[11px] text-white/70 outline-none transition placeholder:text-white/30 focus:border-indigo-500/30 focus:bg-white/[0.05]"
            />
          </div>

          {/* Upload Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-[11px] font-medium text-white hover:bg-white/[0.06]"
          >
            <Plus size={13} />
            New Upload
          </Button>

          {/* Notification */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/[0.06] hover:text-white">
            <Bell size={15} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400" />
          </button>

          {/* Theme Toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/[0.06] hover:text-white"
            onClick={onToggleTheme}
          >
            {theme === "dark" ? (
              <Sun size={15} />
            ) : (
              <Moon size={15} />
            )}
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-2 pr-3 text-white/80 transition hover:bg-white/[0.05]">
                {/* Avatar */}
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-400/20 text-[10px] font-semibold text-white">
                  {user.pfp ? (
                    <img
                      src={user.pfp}
                      alt={`${user.name} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name.slice(0, 2).toUpperCase()
                  )}
                </div>

                {/* User Info */}
                <div className="hidden text-left md:block">
                  <p className="text-[11px] font-medium leading-none text-white">
                    {user.name}
                  </p>

                  <span className="text-[10px] text-white/35">
                    {user.role}
                  </span>
                </div>

                <ChevronDown
                  size={13}
                  className="hidden text-white/30 md:block"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 rounded-2xl border border-white/10 bg-[#0B1020]/95 p-2 text-white shadow-2xl backdrop-blur-xl"
            >
              <DropdownMenuItem className="cursor-pointer rounded-xl text-[11px] text-white/70 focus:bg-white/[0.06] focus:text-white">
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer rounded-xl text-[11px] text-white/70 focus:bg-white/[0.06] focus:text-white">
                Workspace settings
              </DropdownMenuItem>

              <div className="my-1 border-t border-white/10" />

              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer rounded-xl text-[11px] text-rose-200 focus:bg-rose-500/10 focus:text-rose-100"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}