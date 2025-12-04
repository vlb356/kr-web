// src/features/leagues/components/OverviewSection.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OverviewSection({ league }) {
    const [owner, setOwner] = useState(null);

    useEffect(() => {
        if (!league?.ownerUid) return;

        async function loadOwner() {
            try {
                const ref = doc(db, "users", league.ownerUid);
                const snap = await getDoc(ref);
                if (snap.exists()) setOwner(snap.data());
            } catch (err) {
                console.error("Error loading owner:", err);
            }
        }

        loadOwner();
    }, [league]);

    if (!league) return <div>Loading…</div>;

    return (
        <div className="p-4 border rounded bg-gray-50">
            <div className="mb-2">
                <strong>Owner: </strong>
                {owner ? owner.displayName : league.ownerUid}
            </div>

            <div className="mb-2">
                <strong>Visibility: </strong>
                {league.visibility}
            </div>

            <div className="mb-2">
                <strong>Created: </strong>
                {league.createdAt?.toDate().toLocaleString()}
            </div>
        </div>
    );
}
