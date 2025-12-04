// src/features/leagues/components/OverviewSection.jsx
import React from "react";
import { format } from "date-fns";

export default function OverviewSection({ league }) {
    if (!league) return <div className="p-4 text-red-500">No data</div>;

    // Convert Firestore timestamp → JS Date
    let createdAt;

    try {
        createdAt = league.createdAt?.toDate
            ? league.createdAt.toDate()
            : new Date();
    } catch {
        createdAt = new Date();
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

            <h2 className="text-xl font-bold text-[#122944] mb-5">
                Overview
            </h2>

            <div className="space-y-4 text-[#122944]">

                {/* OWNER */}
                <div>
                    <span className="font-semibold">Owner:</span>{" "}
                    <span className="text-[#1662A6] font-medium">
                        {league.ownerName || league.ownerUid}
                    </span>
                </div>

                {/* VISIBILITY */}
                <div>
                    <span className="font-semibold">Visibility:</span>{" "}
                    <span className="capitalize text-[#E96F19] font-medium">
                        {league.visibility}
                    </span>
                </div>

                {/* CREATED DATE */}
                <div>
                    <span className="font-semibold">Created:</span>{" "}
                    {format(createdAt, "dd/MM/yyyy, HH:mm")}
                </div>

            </div>
        </div>
    );
}
