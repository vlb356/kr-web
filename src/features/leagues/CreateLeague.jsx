import React, { useState } from "react";
import { createLeague } from "@/lib/firebase";
import { sha256 } from "@/lib/hash";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui";

export default function CreateLeague() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [sport, setSport] = useState("");
    const [format, setFormat] = useState("");
    const [venue, setVenue] = useState("");

    const [visibility, setVisibility] = useState("public");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        let passwordHash = null;

        if (visibility === "private") {
            if (!password) {
                alert("Please enter a password for a private league.");
                setLoading(false);
                return;
            }
            passwordHash = await sha256(password);
        }

        const leagueId = await createLeague({
            name,
            sport,
            format,
            venue,
            visibility,
            passwordHash,
        });

        navigate(`/league/${leagueId}`);
    }

    return (
        <Container className="py-12 flex justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">

                <h1 className="text-3xl font-bold text-center mb-6 text-[#122944]">
                    Create League
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* NAME */}
                    <div>
                        <label className="block text-sm font-medium mb-1">League Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-3 rounded-lg"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Example: Kaunas Basketball League"
                        />
                    </div>

                    {/* SPORT */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Sport</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-3 rounded-lg"
                            value={sport}
                            onChange={(e) => setSport(e.target.value)}
                            placeholder="Basketball, Football, Padel..."
                        />
                    </div>

                    {/* FORMAT */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Format</label>
                        <input
                            type="text"
                            className="w-full border p-3 rounded-lg"
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            placeholder="Round Robin, Knockout, Mixed..."
                        />
                    </div>

                    {/* VENUE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Venue / Location</label>
                        <input
                            type="text"
                            className="w-full border p-3 rounded-lg"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder="Gym, Stadium, Sport Hall..."
                        />
                    </div>

                    {/* VISIBILITY */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Visibility</label>

                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="w-full border p-3 rounded-lg"
                        >
                            <option value="public">🌐 Public (open to all)</option>
                            <option value="private">🔒 Private (password required)</option>
                        </select>
                    </div>

                    {/* PASSWORD → only if private */}
                    {visibility === "private" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full border p-3 rounded-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter a league password"
                            />
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1662A6] text-white p-3 rounded-lg text-lg font-semibold hover:bg-[#124f84] transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create League"}
                        </button>
                    </div>
                </form>

                {/* BACK BUTTON */}
                <button
                    onClick={() => navigate("/leagues")}
                    className="mt-6 text-[#1662A6] text-center w-full hover:underline"
                >
                    ← Back to Leagues
                </button>

            </div>
        </Container>
    );
}
