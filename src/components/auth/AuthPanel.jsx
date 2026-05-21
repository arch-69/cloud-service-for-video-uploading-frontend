import { useState } from "react";

import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  User2,
  ArrowRight,
} from "lucide-react";

import GoogleAuthProvider from "./GoogleAuthProvider";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function AuthPanel({
  onLogin,
  onRegister,
  onGoogleSignIn,
}) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState(initialForm);

  const [message, setMessage] = useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const updateField = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]:
        event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage(null);

    setIsLoading(true);

    if (mode === "register") {
      const result = await onRegister(form);

      if (!result.ok) {
        setMessage(result.error);

        setIsLoading(false);

        return;
      }

      setMessage(result.message);

      setMode("login");
    } else {
      const result = await onLogin({
        email: form.email,
        password: form.password,
      });

      if (!result.ok) {
        setMessage(result.error);
      }
    }

    setIsLoading(false);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 py-10">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#060B16]/95 p-7 shadow-2xl backdrop-blur-2xl">
        {/* Glow */}
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Brand */}
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10">
            <ShieldCheck
              size={22}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-white">
              CloudDock
            </h1>

            <p className="mt-1 text-[10.5px] text-white/40">
              Professional multipart upload workspace
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div className="relative mt-7 flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-xl px-4 py-2.5 text-[11px] font-medium transition ${
              mode === "login"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() =>
              setMode("register")
            }
            className={`flex-1 rounded-xl px-4 py-2.5 text-[11px] font-medium transition ${
              mode === "register"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative mt-7 space-y-4"
        >
          {/* Full Name */}
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/35">
                Full Name
              </label>

              <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-indigo-500/30 focus-within:bg-white/[0.05]">
                <User2
                  size={15}
                  className="text-white/35"
                />

                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Jane Doe"
                  required
                  className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/35">
              Email
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-indigo-500/30 focus-within:bg-white/[0.05]">
              <Mail
                size={15}
                className="text-white/35"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@company.com"
                required
                className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-white/25"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/35">
              Password
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-indigo-500/30 focus-within:bg-white/[0.05]">
              <LockKeyhole
                size={15}
                className="text-white/35"
              />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                placeholder="••••••••"
                required
                className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-white/25"
              />
            </div>
          </div>

          {/* Error */}
          {message && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-[11px] text-red-200">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-[11px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {isLoading ? (
              "Please wait..."
            ) : mode === "register" ? (
              <>
                Create Account
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center">
          <div className="h-px flex-1 bg-white/10" />

          <span className="px-3 text-[10px] uppercase tracking-[0.14em] text-white/30">
            Or continue with
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google Auth */}
        <div className="relative">
          <GoogleAuthProvider
            onClick={async () => {
              if (!onGoogleSignIn)
                return;

              setIsLoading(true);

              setMessage(null);

              try {
                await onGoogleSignIn();
              } catch (err) {
                setMessage(
                  err?.message ||
                    "Google sign-in failed"
                );
              }

              setIsLoading(false);
            }}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>

        {/* Footer */}
        <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="text-center text-[10.5px] leading-relaxed text-white/40">
            Secure authentication powered by your backend
            infrastructure and encrypted sessions.
          </p>
        </div>
      </div>
    </section>
  );
}