import React, { useState } from "react";
import { proposeScore } from "@/lib/firebase";

export default function ProposeScoreModal({ leagueId, match, onClose }) {
    const [scoreA, setScoreA] = useState("");
    const [scoreB, setScoreB] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        await proposeScore(leagueId, match.id, match.teamACaptainUid || match.teamBCaptainUid, Number(scoreA), Number(scoreB));

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">

                <h2 className="text-2xl font-bold mb-4">Propose Score</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-2">Team A Score</label>
                            <input
                                type="number"
                                min="0"
                                required
                                className="w-full border p-3 rounded-lg"
                                value={scoreA}
                                onChange={(e) => setScoreA(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Team B Score</label>
                            <input
                                type="number"
                                min="0"
                                required
                                className="w-full border p-3 rounded-lg"
                                value={scoreB}
                                onChange={(e) => setScoreB(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1662A6] text-white p-3 rounded-lg font-semibold"
                    >
                        {loading ? "Sending..." : "Submit"}
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
