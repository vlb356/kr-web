// src/features/leagues/CreateLeague.jsx
import React, { useState } from "react";
import { addLeague } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function CreateLeague() {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sport, setSport] = useState("Football");
    const [format, setFormat] = useState("5v5");
    const [venue, setVenue] = useState("");
    const [visibility, setVisibility] = useState("public");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user) return alert("You must be logged in.");

        try {
            const id = await addLeague({
                title,
                description,
                sport,
                format,
                venue,
                visibility,
                ownerUid: user.uid,
                ownerName: user.displayName || user.email
            });

            window.location.hash = `#/league/${id}`;
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">

            {/* Back button */}
            <button
                onClick={() => window.history.back()}
                className="text-[#1662A6] font-medium mb-6"
            >
                ← Back
            </button>

            <h1 className="text-4xl font-bold text-[#122944] mb-8">Create League</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Title */}
                <div>
                    <label className="block font-semibold mb-1">League Name</label>
                    <input
                        type="text"
                        className="w-full border rounded-xl p-3"
                        placeholder="Example: Premier League"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                        className="w-full border rounded-xl p-3"
                        placeholder="Write a short description..."
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Sport */}
                <div>
                    <label className="block font-semibold mb-1">Sport</label>
                    <select
                        className="w-full border rounded-xl p-3"
                        value={sport}
                        onChange={(e) => setSport(e.target.value)}
                    >
                        <option>Football</option>
                        <option>Basketball</option>
                        <option>Paddle</option>
                        <option>Tennis</option>
                        <option>Volleyball</option>
                    </select>
                </div>

                {/* Format */}
                <div>
                    <label className="block font-semibold mb-1">Format</label>
                    <select
                        className="w-full border rounded-xl p-3"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                    >
                        <option>1v1</option>
                        <option>3v3</option>
                        <option>5v5</option>
                        <option>7v7</option>
                    </select>
                </div>

                {/* Venue */}
                <div>
                    <label className="block font-semibold mb-1">Venue</label>
                    <input
                        type="text"
                        className="w-full border rounded-xl p-3"
                        placeholder="Example: Kaunas Arena"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                    />
                </div>

                {/* Visibility */}
                <div>
                    <label className="block font-semibold mb-1">Visibility</label>
                    <select
                        className="w-full border rounded-xl p-3"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                {/* BUTTON */}
                <button className="w-full bg-[#E96F19] text-white py-3 rounded-xl text-lg font-semibold">
                    Create League
                </button>

            </form>
        </div>
    );
}
