import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createTeam } from "@/lib/firebase";

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

export default function CreateTeam() {
    const { leagueId } = useParams();
    const [name, setName] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        await createTeam(leagueId, name);

        window.location.hash = `/league/${leagueId}/teams`;
    }

    return (
        <div className="max-w-xl mx-auto px-6 py-14">
            <BackButton />

            <h1 className="text-3xl font-bold text-[#122944] mb-8">
                Create Team
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium mb-1">Team Name</label>
                    <input
                        className="kr-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Example: Red Dragons"
                        required
                    />
                </div>

                <button
                    className="w-full py-3 rounded-xl text-white font-semibold"
                    style={{ background: "#E96F19" }}
                >
                    Create Team
                </button>
            </form>
        </div>
    );
}
