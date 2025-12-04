// src/features/subscriptions/Subscriptions.jsx
import React from "react";
import useAuth from "@/hooks/useAuth";
import { setSubscriptionPlan } from "@/lib/firebase";

export default function Subscriptions() {
  const { user, sub } = useAuth();

  async function choose(plan) {
    if (!user) {
      window.location.hash = "#/auth";
      return;
    }

    await setSubscriptionPlan(user.uid, plan);
    alert("Your subscription has been updated!");
    window.location.hash = "#/profile/" + user.uid;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">

      <h1 className="text-4xl font-bold text-[#122944] mb-4 text-center">
        Choose Your Subscription
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Unlock access to events, leagues, teams and advanced community features.
      </p>

      <div className="grid md:grid-cols-3 gap-8">

        {/* MONTHLY */}
        <PlanCard
          name="Monthly"
          price="14.99€"
          desc="Basic access to events & community"
          active={sub?.plan === "MONTHLY"}
          disabled={!user}
          onClick={() => choose("MONTHLY")}
        />

        {/* QUARTERLY */}
        <PlanCard
          name="Quarterly"
          price="39.99€"
          desc="Save money · Access leagues & teams"
          active={sub?.plan === "QUARTERLY"}
          disabled={!user}
          onClick={() => choose("QUARTERLY")}
        />

        {/* ANNUAL */}
        <PlanCard
          name="Annual"
          price="119.99€"
          desc="Best option saving money · Full platform access"
          active={sub?.plan === "ANNUAL"}
          disabled={!user}
          onClick={() => choose("ANNUAL")}
        />
      </div>

      {!user && (
        <div className="text-center text-gray-500 mt-10">
          You must create an account to subscribe.
        </div>
      )}
    </div>
  );
}

function PlanCard({ name, price, desc, active, disabled, onClick }) {
  const isActive = active && !disabled;

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition bg-white 
      ${isActive ? "border-[#1662A6] shadow-lg" : "border-gray-300"}
      `}
    >
      <h2 className="text-2xl font-bold text-[#122944]">{name}</h2>

      <p className="text-gray-500 mt-1 mb-4">{desc}</p>

      <div className="text-3xl font-bold text-[#1662A6] mb-6">{price}</div>

      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-2 rounded-xl font-semibold transition
          ${disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : isActive
              ? "bg-gray-300 text-gray-800 cursor-default"
              : "bg-[#E96F19] text-white hover:bg-[#c85f14]"
          }
        `}
      >
        {isActive ? "Current Plan" : disabled ? "Login Required" : "Select Plan"}
      </button>
    </div>
  );
}
