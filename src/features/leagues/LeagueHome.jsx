// src/features/leagues/LeagueHome.jsx
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";

function BackButton() {
    return (
        <button
            onClick={() => window.history.back()}
            className="mb-6 text-[#1662A6] font-semibold hover:underline"
        >
            ← Back
        </button>
    );
}

export default function LeagueHome() {
    const { user } = useAuth();
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "leagues"),
            where("ownerUid", "==", user.uid)
        );

        return onSnapshot(q, (snap) => {
            setLeagues(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto px-6 py-14">
            <BackButton />

            <h1 className="text-4xl font-bold text-[#122944] mb-8">My Leagues</h1>

            {leagues.length === 0 ? (
                <p className="text-gray-600 text-lg">You have not created any leagues yet.</p>
            ) : (
                <div className="space-y-4">
                    {leagues.map((lg) => (
                        <a
                            key={lg.id}
                            href={`#/league/${lg.id}`}
                            className="block p-5 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="text-xl font-semibold">{lg.name}</h3>
                            <p className="text-gray-600 text-sm">{lg.sport}</p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
