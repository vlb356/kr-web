import React, { useState } from "react";
import { createMatch } from "@/lib/firebase";

export default function AddMatchModal({ leagueId, teams, onClose }) {
    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const valid = teamA && teamB && teamA !== teamB;

    async function handleCreate(e) {
        e.preventDefault();
        if (!valid) return;

        setLoading(true);

        await createMatch(leagueId, { teamA, teamB, date });

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">

                <h2 className="text-2xl font-bold mb-4">Add Match</h2>

                <form onSubmit={handleCreate} className="space-y-5">
                    {/* TEAM A */}
                    <div>
                        <label className="block text-sm mb-1">Team A</label>
                        <select
                            className="w-full border p-3 rounded-lg"
                            value={teamA}
                            onChange={(e) => setTeamA(e.target.value)}
                        >
                            <option value="">Select team A</option>
                            {teams.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* TEAM B */}
                    <div>
                        <label className="block text-sm mb-1">Team B</label>
                        <select
                            className="w-full border p-3 rounded-lg"
                            value={teamB}
                            onChange={(e) => setTeamB(e.target.value)}
                        >
                            <option value="">Select team B</option>
                            {teams.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* DATE */}
                    <div>
                        <label className="block text-sm mb-1">Date</label>
                        <input
                            type="datetime-local"
                            className="w-full border p-3 rounded-lg"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!valid}
                        className="w-full bg-[#1662A6] text-white p-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Match"}
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="mt-4 text-[#1662A6] hover:underline w-full"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
