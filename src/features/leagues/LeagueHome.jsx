import React, { useEffect, useState } from "react";
import { db, collection, onSnapshot } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Container } from "@/components/ui";

export default function LeagueHome() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [myLeagues, setMyLeagues] = useState([]);
    const [allLeagues, setAllLeagues] = useState([]);

    useEffect(() => {
        // Listen ALL leagues
        const ref = collection(db, "leagues");

        return onSnapshot(ref, (snap) => {
            const leagues = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            // User's leagues
            const mine = leagues.filter((l) =>
                l.participants?.includes(user?.uid)
            );

            setMyLeagues(mine);
            setAllLeagues(leagues);
        });
    }, [user?.uid]);

    function openLeague(l) {
        // Private league requires password
        if (l.visibility === "private") {
            navigate(`/league/${l.id}/password`);
        } else {
            navigate(`/league/${l.id}`);
        }
    }

    return (
        <Container className="py-10">

            {/* TITLE + CREATE BUTTON */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#122944]">Leagues</h1>

                <button
                    onClick={() => navigate("/create-league")}
                    className="bg-[#1662A6] text-white px-4 py-2 rounded-lg"
                >
                    + Create League
                </button>
            </div>

            {/* MY LEAGUES */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-3">My Leagues</h2>

                {myLeagues.length === 0 && (
                    <p className="text-gray-500 text-sm">You are not part of any league yet.</p>
                )}

                <div className="space-y-3">
                    {myLeagues.map((l) => (
                        <div
                            key={l.id}
                            onClick={() => openLeague(l)}
                            className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        >
                            <div className="font-medium text-lg">{l.name}</div>
                            <div className="text-sm text-gray-500">
                                {l.sport || "Sport"} — {l.format || "Format"}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ALL LEAGUES */}
            <section>
                <h2 className="text-xl font-semibold mb-3">All Leagues</h2>

                {allLeagues.length === 0 && (
                    <p className="text-gray-500 text-sm">No leagues available.</p>
                )}

                <div className="space-y-3">
                    {allLeagues.map((l) => (
                        <div
                            key={l.id}
                            onClick={() => openLeague(l)}
                            className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition flex justify-between items-center"
                        >
                            <div>
                                <div className="font-medium text-lg">{l.name}</div>
                                <div className="text-sm text-gray-500">
                                    {l.sport || "Sport"} — {l.format || "Format"}
                                </div>
                            </div>

                            {/* VISIBILITY ICON */}
                            <div className="text-sm text-gray-500">
                                {l.visibility === "private" ? "🔒 Private" : "🌐 Public"}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Container>
    );
}
