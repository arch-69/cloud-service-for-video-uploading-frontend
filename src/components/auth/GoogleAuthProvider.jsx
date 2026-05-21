export default function GoogleAuthProvider({
  onClick,
  disabled,
  isLoading,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Sign in with Google"
      className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[11px] font-medium text-white transition-all duration-200 hover:bg-white/[0.06] hover:border-white/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Google Icon */}
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white">
        <svg
          width="15"
          height="15"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.9 0 7.3 1.3 10 3.6l7.4-7.4C36.2 2.4 30.5 0 24 0 14.7 0 6.6 4.6 2.5 11.3l8.6 6.7C13.5 13 18 9.5 24 9.5z"
          />

          <path
            fill="#34A853"
            d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.6h12.6c-.5 2.6-2 4.9-4.2 6.4l6.7 5.2c3.9-3.6 6.8-8.9 6.8-15.7z"
          />

          <path
            fill="#4A90E2"
            d="M10.6 29.9c-.9-2.7-1-5.6-.2-8.3L1.9 14.9C.7 17.8 0 20.8 0 24c0 3.2.7 6.2 1.9 9.1l8.7-3.2z"
          />

          <path
            fill="#FBBC05"
            d="M24 48c6.5 0 12.2-2.1 16.3-5.8l-7.9-6.1C31.4 34.9 27.8 36 24 36c-6 0-10.5-3.5-12.9-8.7L2.5 36.7C6.6 43.4 14.7 48 24 48z"
          />
        </svg>
      </div>

      {/* Label */}
      <span className="relative text-[11px] font-medium tracking-[0.01em] text-white/90">
        {isLoading
          ? "Signing in..."
          : "Continue with Google"}
      </span>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="relative h-3.5 w-3.5 animate-spin rounded-full border border-white/20 border-t-white" />
      )}
    </button>
  );
}