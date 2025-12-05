// src/features/leagues/components/AddTeamModal.jsx
import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddTeamModal({ leagueId, onClose, onCreated }) {
    const [name, setName] = useState("");
    const [initials, setInitials] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#1662A6");
    const [capacity, setCapacity] = useState(10);

    async function handleCreate() {
        if (!name || !initials) {
            alert("Name and initials are required");
            return;
        }

        const id = crypto.randomUUID();

        await setDoc(doc(db, "leagues", leagueId, "teams", id), {
            name,
            initials,
            description,
            color,
            maxPlayers: Number(capacity),
            members: [],
            captainUid: null,
            createdAt: serverTimestamp(),
        });

        onCreated();
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[380px] shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Create Team</h2>

                <label className="block mb-2 text-sm">Team Name</label>
                <input
                    className="w-full p-2 border rounded mb-4"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label className="block mb-2 text-sm">Initials</label>
                <input
                    className="w-full p-2 border rounded mb-4"
                    value={initials}
                    maxLength={3}
                    onChange={(e) => setInitials(e.target.value.toUpperCase())}
                />

                <label className="block mb-2 text-sm">Description</label>
                <textarea
                    className="w-full p-2 border rounded mb-4 text-sm"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of the team (style, level, goals...)"
                />

                <label className="block mb-2 text-sm">Color</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 mb-4 rounded"
                />

                <label className="block mb-2 text-sm">Max Players</label>
                <input
                    type="number"
                    min="1"
                    max="20"
                    className="w-full p-2 border rounded mb-4"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-[#1662A6] text-white rounded"
                        onClick={handleCreate}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
