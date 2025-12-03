// src/features/profile/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile as fbUpdateProfile } from "firebase/auth";

export default function EditProfile() {
    const uid = auth.currentUser?.uid;

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const data = snap.data();
            setName(data.name || "");
            setBio(data.bio || "");
        }
        setLoading(false);
    }

    async function save(e) {
        e.preventDefault();

        const ref = doc(db, "users", uid);
        // 1) Actualizamos Firestore
        await updateDoc(ref, { name, bio });

        // 2) Actualizamos también el displayName de Firebase Auth
        if (auth.currentUser) {
            await fbUpdateProfile(auth.currentUser, { displayName: name });
        }

        // 3) Navegamos directo al perfil y refrescamos para que Nav coja el nuevo nombre
        window.location.hash = `/profile/${uid}`;
        // Forzamos que useAuth se vuelva a evaluar y el header muestre la inicial correcta
        window.location.reload();
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    const avatarInitial =
        name?.charAt(0)?.toUpperCase() ||
        auth.currentUser?.email?.charAt(0)?.toUpperCase() ||
        "U";

    return (
        <div className="max-w-lg mx-auto px-6 py-10">
            <div className="bg-white shadow-lg p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-semibold text-[#122944] mb-6">
                    Edit Profile
                </h2>

                {/* Avatar preview basado en el nombre */}
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-[#1662A6] text-white flex items-center justify-center text-3xl font-bold">
                        {avatarInitial}
                    </div>
                </div>

                <form onSubmit={save} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Name
                        </label>
                        <input
                            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#1662A6]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Bio
                        </label>
                        <textarea
                            className="w-full border px-3 py-2 rounded-lg h-28 focus:ring-2 focus:ring-[#1662A6]"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell people something about you..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#E96F19] text-white py-2 rounded-lg font-semibold hover:bg-[#c75c14] transition"
                    >
                        Save changes
                    </button>
                </form>
            </div>
        </div>
    );
}

