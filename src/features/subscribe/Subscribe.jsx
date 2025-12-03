// src/features/subscribe/Subscribe.jsx
import React, { useState } from "react";
import { auth } from "@/lib/firebase";

export default function Subscribe() {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    setLoading(true);
    try {
      // Aquí iría el checkout real de Stripe en el futuro:
      // const res = await createCheckoutSession(user);

      alert("Subscription activated (demo mode).");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="kr-card p-8">
        <h2 className="text-2xl font-bold mb-2">KR One Pass</h2>
        <p className="text-gray-600 mb-6">
          One monthly subscription — unlimited access to venues, events, leagues and community features.
        </p>

        {/* PLANS */}
        <div className="grid gap-4">
          <Plan
            title="Monthly"
            price="9.99 €"
            desc="Cancel anytime"
            onSelect={handleSubscribe}
            loading={loading}
          />
          <Plan
            title="Quarterly"
            price="24.99 €"
            desc="Save 15%"
            onSelect={handleSubscribe}
            loading={loading}
          />
          <Plan
            title="Yearly"
            price="79.99 €"
            desc="Save 35%"
            onSelect={handleSubscribe}
            loading={loading}
          />
        </div>

        {/* WARNING */}
        {!user && (
          <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-700">
            You must be logged in to subscribe.
          </div>
        )}
      </div>
    </div>
  );
}

function Plan({ title, price, desc, onSelect, loading }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-500 text-sm">{desc}</p>
        </div>
        <span className="text-xl font-bold">{price}</span>
      </div>

      <button
        className="kr-btn-primary w-full mt-4"
        disabled={loading}
        onClick={onSelect}
      >
        {loading ? "Processing..." : "Subscribe"}
      </button>
    </div>
  );
}
