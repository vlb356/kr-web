import React, { useEffect, useMemo, useState } from "react";
import {
  onAuthChanged,
  loginEmailPassword,
  registerEmailPassword,
} from "../lib/firebase";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Read ?next=/social (default /explore)
  const nextRoute = useMemo(() => {
    try {
      const h = window.location.hash || "#/auth";
      const qs = h.includes("?") ? h.split("?")[1] : "";
      const p = new URLSearchParams(qs).get("next");
      if (p && /^\/[a-z0-9\-/_]*$/i.test(p)) return p;
    } catch {}
    return "/explore";
  }, []);

  // Observe session only (no auto-redirect)
  useEffect(() => {
    const unsub = onAuthChanged((u) => setCurrentUser(u || null));
    return unsub;
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "login") {
        await loginEmailPassword(email.trim(), pass);
      } else {
        if (!name.trim()) throw new Error("Enter your name");
        if (pass.length < 6) throw new Error("Password must be at least 6 characters");
        await registerEmailPassword(name.trim(), email.trim(), pass);
      }
      // Redirect to requested destination
      window.location.hash = "#" + nextRoute.replace(/^\//, "");
    } catch (e2) {
      console.error(e2);
      setErr(
        (e2 && e2.message ? e2.message.replace("Firebase:", "").trim() : "") ||
          "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-white to-kr-ivory">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 px-4 py-10">

        {/* LEFT (hero) */}
        <section className="hidden lg:flex flex-col justify-center rounded-3xl bg-gradient-to-br from-[#0d1b2a] via-[#1b2a41] to-[#2b3a55] text-white p-10 shadow-xl">
          <span className="inline-flex items-center gap-2 text-xs tracking-wide uppercase bg-white/10 px-3 py-1 rounded-full">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-300" />
            Secure access
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            One login for all your <span className="text-teal-300">sports</span>.
          </h1>
          <p className="text-white/85 text-lg mt-4">
            Join games, book courts, create events, and chat with your community. Your
            subscription, your way.
          </p>
          <ul className="space-y-3 mt-6 text-white/90">
            <li className="flex items-center gap-2"><Check /> Access to public & private venues</li>
            <li className="flex items-center gap-2"><Check /> Create & join events</li>
            <li className="flex items-center gap-2"><Check /> Leagues & tournaments</li>
            <li className="flex items-center gap-2"><Check /> Forum & community</li>
          </ul>
        </section>

        {/* RIGHT (form) */}
        <section className="flex items-center">
          <div className="w-full">
            {/* Notice if already signed in */}
            {currentUser && (
              <div className="max-w-xl mx-auto mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 flex items-center justify-between">
                <div className="text-sm">
                  You are already signed in as <b>{currentUser.email || currentUser.displayName}</b>.
                </div>
                <a
                  href="#/explore"
                  className="ml-4 inline-flex items-center h-9 px-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Go to Explore
                </a>
              </div>
            )}

            <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden">
              {/* Tabs */}
              <div className="flex">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 h-12 text-sm font-medium tracking-wide ${
                    mode === "login"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`flex-1 h-12 text-sm font-medium tracking-wide ${
                    mode === "register"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Create account
                </button>
              </div>

              <form onSubmit={submit} className="p-6 md:p-8 space-y-5">
                {mode === "register" && (
                  <Field
                    label="Name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<UserIcon />}
                    required
                  />
                )}

                <Field
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<MailIcon />}
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      className="w-full h-11 rounded-2xl border border-gray-300 pl-11 pr-12 outline-none focus:ring-2 focus:ring-sky-500"
                      type={showPass ? "text" : "password"}
                      placeholder={mode === "login" ? "••••••••" : "At least 6 characters"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      required
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <LockIcon />
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      title={showPass ? "Hide" : "Show"}
                    >
                      {showPass ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {err && (
                  <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">
                    {err}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full h-11 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {busy ? "Loading…" : mode === "login" ? "Sign in" : "Create account"}
                </button>

                <div className="pt-2 text-xs text-gray-500">
                  By continuing, you agree to our community guidelines.
                </div>
              </form>
            </div>

            <div className="max-w-xl mx-auto flex items-center justify-between text-sm text-gray-600 mt-4 px-1">
              <a href="#/explore" className="hover:underline">← Back to Explore</a>
              <a href="#/subscribe" className="hover:underline">About One Pass</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function Field({ label, icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          className="w-full h-11 rounded-2xl border border-gray-300 pl-11 pr-4 outline-none focus:ring-2 focus:ring-sky-500"
          {...props}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      </div>
    </div>
  );
}

/* ---------- Icons ---------- */
function Check() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"/></svg>); }
function MailIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6"/><path d="m4 6 8 6 8-6" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>); }
function LockIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function UserIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function Eye() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function EyeOff() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7c2.2 0 4.1.8 5.7 1.8M22 12s-4 7-10 7c-2.2 0-4.1-.8-5.7-1.8" stroke="currentColor" strokeWidth="1.6"/><path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6"/></svg>); }
