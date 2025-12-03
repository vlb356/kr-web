import React from "react";

export default function SubscriptionRequired() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-3xl font-bold text-[#122944] mb-4">
                Subscription Required
            </h1>

            <p className="text-gray-600 max-w-md mb-6">
                You must have an active Komanda Ryšys subscription to access this content.
            </p>

            <a
                href="#/subscriptions"
                className="px-6 py-3 rounded-xl bg-[#E96F19] text-white font-semibold hover:bg-[#d85f12]"
            >
                View Subscription Plans
            </a>
        </div>
    );
}
