import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Link } from "react-router-dom";

export default function OverviewSection({ league }) {
    const user = auth.currentUser;
    const leagueId = league?.id;

    const [ownerName, setOwnerName] = useState("");
    const [teamsCount, setTeamsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const isOwner = user && league?.ownerUid === user.uid;

    /* -----------------------------
       LOAD OWNER NAME
    ----------------------------- */
    useEffect(() => {
        if (!league?.ownerUid) return;

        async function loadOwner() {
            const ref = doc(db, "users", league.ownerUid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setOwnerName(snap.data().name || snap.data().email);
            } else {
                setOwnerName("Unknown");
            }
        }

        loadOwner();
    }, [league]);

    /* -----------------------------
       LOAD TEAMS COUNT
    ----------------------------- */
    useEffect(() => {
        if (!leagueId) return;

        async function loadTeams() {
            setLoading(true);
            const snap = await getDocs(
                collection(db, "leagues", leagueId, "teams")
            );
            setTeamsCount(snap.size);
            setLoading(false);
        }

        loadTeams();
    }, [leagueId]);

    return (
        <div className="space-y-8">

            {/* ADMIN PANEL */}
            {isOwner && (
                <div className="bg-[#122944] text-white rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
                    <p className="text-sm opacity-90 mb-4">
                        Manage league configuration and matches
                    </p>

                    <Link
                        to="matches"
                        className="inline-block bg-[#E96F19] px-5 py-2 rounded-lg font-semibold hover:bg-[#cf5f15]"
                    >
                        Generate Matches
                    </Link>
                </div>
            )}

            {/* LEAGUE INFO */}
            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-white border rounded-xl p-6">
                    <p className="text-gray-500 text-sm">League owner</p>
                    <p className="font-semibold text-lg text-[#122944]">
                        {ownerName || "—"}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-6">
                    <p className="text-gray-500 text-sm">Teams</p>
                    <p className="font-semibold text-lg text-[#122944]">
                        {loading ? "Loading…" : teamsCount}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-6">
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="font-semibold text-lg text-green-600">
                        Active
                    </p>
                </div>

            </div>
        </div>
    );
}
