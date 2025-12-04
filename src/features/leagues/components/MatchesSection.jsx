// src/features/leagues/components/MatchesSection.jsx
import React, { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    doc,
    getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function MatchesSection({ leagueId }) {
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        if (!leagueId) return;
        loadTeams();
        loadMatches();
    }, [leagueId]);

    async function loadTeams() {
        try {
            const ref = collection(db, "leagues", leagueId, "teams");
            const snap = await getDocs(ref);

            const arr = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));

            setTeams(arr);
        } catch (err) {
            console.error("Error loading teams:", err);
        }
    }

    async function loadMatches() {
        try {
            const ref = collection(db, "leagues", leagueId, "matches");
            const snap = await getDocs(ref);

            const arr = [];

            for (const docSnap of snap.docs) {
                const m = { id: docSnap.id, ...docSnap.data() };

                // Load team names
                if (m.teamA) {
                    const tRef = doc(db, "leagues", leagueId, "teams", m.teamA);
                    const tSnap = await getDoc(tRef);
                    m.teamAName = tSnap.exists() ? tSnap.data().name : "(Unknown)";
                }

                if (m.teamB) {
                    const tRef = doc(db, "leagues", leagueId, "teams", m.teamB);
                    const tSnap = await getDoc(tRef);
                    m.teamBName = tSnap.exists() ? tSnap.data().name : "(Unknown)";
                }

                arr.push(m);
            }

            setMatches(arr);
        } catch (err) {
            console.error("Error loading matches:", err);
        }
    }

    return (
        <div className="mt-8 space-y-4">
            {matches.length === 0 && (
                <div className="text-gray-500">No matches available.</div>
            )}

            {matches.map((m) => (
                <div key={m.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="font-medium">
                        {m.teamAName || "—"} vs {m.teamBName || "—"}
                    </div>

                    <div className="text-sm text-gray-600">
                        Score:{" "}
                        <span className="font-semibold">
                            {m.scoreA ?? "-"} : {m.scoreB ?? "-"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
