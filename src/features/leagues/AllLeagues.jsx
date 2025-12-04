import React, { useEffect, useState } from "react";
import { db, collection, getDocs, query, where } from "@/lib/firebase";

export default function AllLeagues() {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const ref = collection(db, "leagues");

                const q = query(
                    ref,
                    where("visibility", "==", "public")
                );

                const snap = await getDocs(q);
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

                setLeagues(list);
            } catch (err) {
                console.error("Error loading AllLeagues:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <button
                onClick={() => window.history.back()}
                className="text-[#1662A6] font-medium mb-6"
            >
                ← Back
            </button>

            <h1 className="text-3xl font-bold mb-6 text-[#122944]">All Public Leagues</h1>

            {leagues.length === 0 && (
                <p className="text-gray-500">No public leagues available.</p>
            )}

            <div className="space-y-4">
                {leagues.map((lg) => (
                    <a
                        href={`#/league/${lg.id}`}
                        key={lg.id}
                        className="block p-4 border rounded-xl shadow hover:shadow-lg bg-white"
                    >
                        <h2 className="text-xl font-semibold">{lg.title}</h2>
                        <p className="text-gray-500">{lg.sport} — {lg.format}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}
