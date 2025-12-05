// src/features/leagues/components/OverviewSection.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OverviewSection({ league }) {
    const leagueId = league?.id;

    const [ownerName, setOwnerName] = useState("");
    const [teamsCount, setTeamsCount] = useState(null);
    const [loadingTeams, setLoadingTeams] = useState(true);

    // ------------------------------
    // LOAD OWNER NAME
    // ------------------------------
    useEffect(() => {
        if (!league?.ownerUid) return;

        async function loadOwner() {
            try {
                const ref = doc(db, "users", league.ownerUid);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    setOwnerName(data.displayName || data.name || league.ownerUid);
                } else {
                    setOwnerName(league.ownerUid);
                }
            } catch (err) {
                console.error("Error loading owner profile:", err);
                setOwnerName(league.ownerUid);
            }
        }

        loadOwner();
    }, [league?.ownerUid]);

    // ------------------------------
    // LOAD TEAMS COUNT
    // ------------------------------
    useEffect(() => {
        if (!leagueId) return;

        async function loadTeamsCount() {
            try {
                setLoadingTeams(true);
                const ref = collection(db, "leagues", leagueId, "teams");
                const snap = await getDocs(ref);
                setTeamsCount(snap.size);
            } catch (err) {
                console.error("Error loading teams count:", err);
                setTeamsCount(0);
            } finally {
                setLoadingTeams(false);
            }
        }

        loadTeamsCount();
    }, [leagueId]);

    if (!league) return <div className="text-sm text-gray-500">League not found</div>;

    const createdAtDate =
        league.createdAt?.toDate?.() instanceof Date
            ? league.createdAt.toDate()
            : null;

    return (
        <div className="mt-6 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-semibold text-[#122944] mb-3">Overview</h2>

                <div className="space-y-2 text-sm">
                    <div>
                        <span className="font-medium text-gray-600">Owner: </span>
                        <span className="text-[#1662A6]">{ownerName || league.ownerUid}</span>
                    </div>

                    <div>
                        <span className="font-medium text-gray-600">Visibility: </span>
                        <span className="uppercase text-xs px-2 py-0.5 rounded-full bg-[#e6f0f8] text-[#1662A6] font-semibold">
                            {league.visibility || "private"}
                        </span>
                    </div>

                    <div>
                        <span className="font-medium text-gray-600">Teams: </span>
                        {loadingTeams ? (
                            <span className="text-gray-400">Loading…</span>
                        ) : (
                            <span>{teamsCount ?? 0}</span>
                        )}
                    </div>

                    <div>
                        <span className="font-medium text-gray-600">Created: </span>
                        {createdAtDate ? (
                            <span>
                                {createdAtDate.toLocaleDateString()}{" "}
                                {createdAtDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        ) : (
                            <span>-</span>
                        )}
                    </div>
                </div>
            </div>

            {league.description && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-semibold text-[#122944] mb-2">
                        League Description
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                        {league.description}
                    </p>
                </div>
            )}
        </div>
    );
}
