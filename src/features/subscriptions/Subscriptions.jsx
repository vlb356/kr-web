import React from "react";
import useAuth from "@/hooks/useAuth";
import { setSubscriptionPlan } from "@/lib/firebase";

export default function Subscriptions() {
  const { user, sub } = useAuth();

  if (!user) {
    return (
      <div className="p-20 text-center text-xl text-gray-600">
        Please log in to manage your subscription.
      </div>
    );
  }

  async function choose(plan) {
    await setSubscriptionPlan(user.uid, plan);
    alert("Your subscription has been updated!");
    window.location.hash = "#/profile/" + user.uid;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">

      <h1 className="text-4xl font-bold text-[#122944] mb-10 text-center">
        Choose Your Subscription
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* MONTHLY */}
        <PlanCard
          name="Monthly"
          price="14.99€"
          desc="Basic access"
          active={sub.plan === "Monthly"}
          onClick={() => choose("MONTHLY")}
        />

        {/* QUARTERLY */}
        <PlanCard
          name="Quarterly"
          price="39.99€"
          desc="Full access to events, leagues & courts"
          active={sub.plan === "Quarterly"}
          onClick={() => choose("QUARTERLY")}
        />

        {/* ANNUAL */}
        <PlanCard
          name="Annual"
          price="119.99€"
          desc="Save 30% vs monthly · Priority support"
          active={sub.plan === "annual"}
          onClick={() => choose("ANNUAL")}
        />
      </div>
    </div>
  );
}

function PlanCard({ name, price, desc, active, onClick }) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition cursor-pointer 
      ${active ? "border-[#1662A6] shadow-lg" : "border-gray-300"}`}
      onClick={onClick}
    >
      <h2 className="text-2xl font-bold text-[#122944]">{name}</h2>
      <p className="text-gray-500 mt-1 mb-4">{desc}</p>

      <div className="text-3xl font-bold text-[#1662A6] mb-6">{price}</div>

      <button
        className={`w-full py-2 rounded-xl font-semibold 
        ${active ? "bg-gray-300 text-gray-800" : "bg-[#1662A6] text-white hover:bg-[#0f4c7a]"}`}
      >
        {active ? "Current Plan" : "Select Plan"}
      </button>
    </div>
  );
}
