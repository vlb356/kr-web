import React from "react";
import { Link } from "react-router-dom";

export default function Marketing() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      {/* HERO */}
      <section
        className="
          relative overflow-hidden rounded-2xl
          bg-gradient-to-r from-[#0D1B2A] via-[#1B4B7A] to-[#7C3AED]
          text-white shadow-xl
        "
      >
        {/* Decor */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative px-6 py-14 md:px-10 md:py-16">
          <div className="mb-4 text-xs uppercase tracking-wide text-white/70">
            Komanda Ryžys · MVP
          </div>
          <h1 className="text-3xl leading-tight font-extrabold md:text-5xl md:leading-[1.15]">
            One subscription. <span className="opacity-90">All sports.</span>{" "}
            <span className="opacity-90">One city.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base md:text-lg text-white/85">
            Access gyms, university facilities and private venues with a single
            plan. Create or join games, meet people and compete in local leagues.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/subscribe"
              className="
                inline-flex items-center justify-center rounded-xl
                bg-white px-4 py-2.5 text-sm font-semibold text-[#0D1B2A]
                shadow-sm hover:bg-gray-100 active:bg-gray-200 transition
              "
            >
              Subscribe
            </Link>

            <a
              href="#features"
              className="
                inline-flex items-center justify-center rounded-xl
                bg-white/10 px-4 py-2.5 text-sm font-semibold text-white
                ring-1 ring-inset ring-white/30 hover:bg-white/15 transition
              "
            >
              See what’s included
            </a>

            <Link
              to="/explore"
              className="
                inline-flex items-center justify-center rounded-xl
                bg-black/40 px-4 py-2.5 text-sm font-semibold text-white
                ring-1 ring-inset ring-white/25 hover:bg-black/50 transition
              "
            >
              Browse venues
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section id="features" className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">What’s inside?</h2>
        <p className="mt-1 text-sm text-gray-600">
          Everything you need to play more, with less friction.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            badge="ACCESS"
            title="Multi-venue access"
            desc="Use gyms, universities and private courts with one subscription."
            icon="🏟️"
          />
          <FeatureCard
            badge="GAME"
            title="Events & bookings"
            desc="Create pick-up games or book a court with friends in seconds."
            icon="📅"
          />
          <FeatureCard
            badge="COMPETE"
            title="Leagues & tournaments"
            desc="Weekend formats, round-robin, brackets and city ladders."
            icon="🥇"
          />
          <FeatureCard
            badge="COMMUNITY"
            title="Social forum"
            desc="Find teammates, share highlights and organize matches."
            icon="💬"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-10">
        <h3 className="text-xl font-bold text-gray-900">How it works</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StepCard
            n="1"
            title="Subscribe"
            desc="Activate One Pass with a single click."
          />
          <StepCard
            n="2"
            title="Explore"
            desc="Pick a venue, join a game or create your own."
          />
          <StepCard n="3" title="Play" desc="Show up, have fun and meet people." />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">One Pass</h4>
              <p className="text-sm text-gray-600">
                One subscription for all sports in your city. Cancel anytime.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/subscribe"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Start now
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Browse venues
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          One subscription for all sports
        </p>
      </section>
    </main>
  );
}

function FeatureCard({ badge, title, desc, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-base">
          {icon}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-gray-700">
          {badge}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm leading-5 text-gray-600">{desc}</p>
    </div>
  );
}

function StepCard({ n, title, desc }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
          {n}
        </span>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
      </div>
      <p className="text-sm leading-5 text-gray-600">{desc}</p>
    </div>
  );
}
