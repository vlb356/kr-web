import React, { useState } from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function Nav({ route = "/", user, sub, onLogout = () => {} }) {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/explore", label: "Explore" },
    { to: "/events", label: "Events" },
    { to: "/social", label: "Social" },
    { to: "/leagues", label: "Leagues" },
    { to: "/subscribe", label: "Subscribe" },
  ];

  const Item = ({ to, label }) => {
    const active =
      route === to ||
      (to !== "/" && route.startsWith(to)) ||
      (to === "/" && route === "/");
    return (
      <a
        href={`#${to}`}
        className={cx(
          "px-3 py-2 rounded-xl text-sm transition-colors",
          active
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-100"
        )}
        onClick={() => setOpen(false)}
      >
        {label}
      </a>
    );
  };

  const userLabel = user?.displayName || user?.email || "User";

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="kr-container h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#/" className="flex items-center gap-2">
          <img
            src="/kr-logo-64.png"
            alt="KR"
            className="h-7 w-7 object-contain"
          />
          <span className="font-semibold">Komanda Ryžys</span>
          <span className="kr-badge">MVP</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <Item key={l.to} to={l.to} label={l.label} />
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {sub?.active ? (
            <span className="kr-badge-ok">Subscribed</span>
          ) : (
            <a href="#/subscribe" className="text-sm underline">
              Subscription
            </a>
          )}

          {user ? (
            <>
              <span className="kr-badge">{userLabel}</span>
              <button className="kr-btn-primary" onClick={onLogout}>
                Log out
              </button>
            </>
          ) : (
            <a href="#/auth" className="text-sm underline">
              Sign in
            </a>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden kr-btn"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="i-h-5 i-w-5 relative block">
            <span className="block h-0.5 w-5 bg-gray-700 mb-1"></span>
            <span className="block h-0.5 w-5 bg-gray-700 mb-1"></span>
            <span className="block h-0.5 w-5 bg-gray-700"></span>
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="kr-container py-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {sub?.active ? (
                <span className="kr-badge-ok">Subscribed</span>
              ) : (
                <a href="#/subscribe" className="text-sm underline">
                  Subscription
                </a>
              )}

              {user ? (
                <>
                  <span className="kr-badge">{userLabel}</span>
                  <button className="kr-btn-primary" onClick={onLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <a href="#/auth" className="text-sm underline">
                  Sign in
                </a>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {links.map((l) => (
                <Item key={l.to} to={l.to} label={l.label} />
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
