import React from "react";

const PLANS = [
  {
    key: "monthly",
    name: "Monthly",
    price: "€14.99",
    period: "/month",
    note: "Popular",
    features: [
      "All venues & all sports",
      "Create & join events",
      "Local leagues & tournaments",
      "Social forum"
    ]
  },
  {
    key: "quarterly",
    name: "3 Months",
    price: "€39.99",
    period: "/3 months",
    note: "Save vs monthly",
    features: [
      "All venues & all sports",
      "Create & join events",
      "Local leagues & tournaments",
      "Social forum"
    ]
  },
  {
    key: "annual",
    name: "Annual",
    price: "€139.00",
    period: "/year",
    note: "Best value",
    features: [
      "All venues & all sports",
      "Create & join events",
      "Local leagues & tournaments",
      "Social forum"
    ]
  }
];

export default function Subscribe({ sub, onPay = () => {}, onAfterPay = () => {} }) {
  const current = sub?.plan || null;

  const choose = async (k) => {
    await onPay(k);
    onAfterPay();
  };

  return (
    <div className="space-y-6">
      <div className="kr-card-lg bg-gradient-to-br from-white to-neutral-100">
        <h1 className="text-2xl font-bold">Choose your plan</h1>
        <p className="text-sm text-gray-600 mt-2">
          One pass for all sports and venues. Upgrade or change anytime.
        </p>
        {sub?.active && (
          <div className="mt-3 kr-badge-ok">Subscribed{current ? ` · Current: ${current}` : ""}</div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((p) => {
          const isCurrent = current === p.key;
          return (
            <div key={p.key} className="kr-card p-0 overflow-hidden">
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{p.name}</h3>
                  <span className="kr-chip">{p.note}</span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-black text-kr-orange">{p.price}</span>
                  <span className="ml-2 text-sm text-gray-500">{p.period}</span>
                </div>
              </div>

              <div className="p-4">
                <ul className="text-sm space-y-1">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-kr-blue" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  {isCurrent ? (
                    <button className="kr-btn w-full cursor-default opacity-70" disabled>
                      Your current plan
                    </button>
                  ) : (
                    <button className="kr-btn-primary w-full" onClick={() => choose(p.key)}>
                      Switch to this plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        Prices shown are examples. You can update or cancel your plan at any time.
      </p>
    </div>
  );
}
