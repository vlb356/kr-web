// src/features/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function Profile() {
  const { uid } = useParams();
  const { user: current } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // === LOAD USER PROFILE ===
  useEffect(() => {
    async function loadProfile() {
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Profile error:", err);
      }
      setLoading(false);
    }
    loadProfile();
  }, [uid]);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500">Loading…</div>
    );

  if (!profile)
    return (
      <div className="flex flex-col items-center py-20">
        <h2 className="text-xl font-semibold">User not found</h2>
        <p className="text-gray-600 mt-2">This profile doesn't exist.</p>
      </div>
    );

  const isOwner = current?.uid === uid;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* ====================== HEADER CARD ====================== */}
      <div className="kr-card p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
          {profile.name?.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>

          <p className="text-gray-600 mt-1">{profile.email}</p>

          {profile.subscription?.active ? (
            <div className="mt-3 inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
              Active plan: {profile.subscription.plan}
            </div>
          ) : (
            <div className="mt-3 inline-block bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium">
              No subscription
            </div>
          )}

          {isOwner && (
            <a
              href="#/settings"
              className="inline-block mt-4 text-sm text-blue-600 font-medium underline"
            >
              Edit profile
            </a>
          )}
        </div>
      </div>

      {/* ====================== STATS ROW ====================== */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <StatCard label="Posts" value={profile.posts || 0} />
        <StatCard label="Events joined" value={profile.events || 0} />
        <StatCard label="Leagues" value={profile.leagues || 0} />
      </div>

      {/* ====================== RECENT ACTIVITY ====================== */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent activity</h2>

        <div className="kr-card p-6">
          <p className="text-gray-500 text-sm">
            No recent activity yet. Join events and comment on forums to see
            updates here.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= SUB-COMPONENT ========================= */
function StatCard({ label, value }) {
  return (
    <div className="kr-card p-5 text-center shadow-sm">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-600 text-sm mt-1">{label}</p>
    </div>
  );
}
