// src/features/leagues/TeamDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import TeamLogo from "./components/TeamLogo";

export default function TeamDetail() {
    const { leagueId, teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if (!leagueId || !teamId) return;
        loadTeam();
    }, [leagueId, teamId]);

    async function loadTeam() {
        try {
            const teamRef = doc(db, "leagues", leagueId, "teams", teamId);
            const teamSnap = await getDoc(teamRef);

            if (!teamSnap.exists()) {
                setTeam(null);
                return;
            }

            const data = teamSnap.data();
            setTeam(data);

            // ------- LOAD USERS -------
            const members = data.members || [];
            const users = [];

            for (const uid of members) {
                const userRef = doc(db, "users", uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const info = userSnap.data();
                    users.push({
                        uid,
                        name: info.name || "(No name)",
                    });
                } else {
                    users.push({ uid, name: "(Unknown user)" });
                }
            }

            setPlayers(users);
        } catch (err) {
            console.error("Error loading team:", err);
        }
    }

    if (!team) return <div className="p-6">Team not found</div>;

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
                <TeamLogo initials={team.initials} color={team.color} />
                <h1 className="text-2xl font-bold">{team.name}</h1>
            </div>

            {/* PLAYERS */}
            <h2 className="font-semibold mb-3 text-lg">Players</h2>

            <div className="space-y-2">
                {players.map((p) => (
                    <div
                        key={p.uid}
                        className="p-3 rounded bg-gray-100 flex items-center gap-3"
                    >
                        {/* INICIALES */}
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                            {p.name
                                .split(" ")
                                .map((x) => x[0]?.toUpperCase())
                                .join("")}
                        </div>

                        {/* INFORMACIÓN */}
                        <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-sm text-gray-500">{p.uid}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
