// src/features/marketing/Marketing.jsx
import React from "react";

export default function Marketing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* HERO */}
      <header className="px-6 py-16 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          The One-Pass Sports Platform for Lithuania
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Book courts, join leagues, meet players and unlock unlimited access with one subscription.
        </p>

        <a
          href="#/subscribe"
          className="mt-6 inline-block kr-btn-primary px-8 py-3 text-lg rounded-xl"
        >
          Get One Pass
        </a>
      </header>

      {/* FEATURES GRID */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        <Feature
          title="Book Venues"
          desc="Find padel courts, gyms and sports halls across Lithuania with real-time availability."
        />
        <Feature
          title="Join Events"
          desc="Pick-up games, training sessions, tournaments and friendly matches in your city."
        />
        <Feature
          title="Compete in Leagues"
          desc="Weekly fixtures, standings and tournaments for all levels. Stay motivated all season."
        />
      </section>

      {/* VALUE SECTION */}
      <section className="bg-gray-900 text-white py-16 px-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">One Subscription. Unlimited Sports.</h2>
          <p className="text-gray-300 text-lg max-w-3xl">
            The KR One Pass gives you access to courts, workouts, leagues, tournaments and the entire social community — all in one membership.
          </p>

          <a
            href="#/subscribe"
            className="mt-8 inline-block kr-btn-white px-8 py-3 text-lg rounded-xl"
          >
            Subscribe
          </a>
        </div>
      </section>

      {/* CTA */}
      <footer className="py-20 text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to start?</h3>
        <p className="mb-6 text-gray-600">
          Create your account and start exploring sports around you.
        </p>

        <a href="#/auth" className="kr-btn-primary px-8 py-3 text-lg rounded-xl">
          Create free account
        </a>
      </footer>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
