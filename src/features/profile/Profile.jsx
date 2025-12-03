// src/features/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadPosts();
  }, [id]);

  async function loadProfile() {
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setProfile(snap.data());

      // followers
      const followersRef = collection(db, "users", id, "followers");
      const followersSnap = await getDocs(followersRef);
      setFollowers(followersSnap.size);

      // following
      const followingRef = collection(db, "users", id, "following");
      const followingSnap = await getDocs(followingRef);
      setFollowing(followingSnap.size);
    }
    setLoading(false);
  }

  async function loadPosts() {
    const qy = query(
      collection(db, "forums"),
      where("ownerUid", "==", id)
    );

    const snap = await getDocs(qy);
    setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-10 text-center text-xl">User not found.</div>;

  const initial =
    profile?.name?.charAt(0).toUpperCase() ||
    profile?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* HEADER CARD */}
      <div className="bg-[#122944] text-white rounded-2xl p-8 shadow-md flex items-center gap-6">
        <div className="h-24 w-24 rounded-full flex items-center justify-center text-4xl font-bold bg-[#1662A6]">
          {initial}
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="opacity-80">{profile.email}</p>

          {profile.subscription?.active && (
            <span className="inline-block mt-3 px-3 py-1 text-sm bg-[#E96F19] text-white rounded-full">
              ACTIVE: {profile.subscription.plan}
            </span>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-gray-200 text-sm max-w-lg leading-relaxed">
              {profile.bio}
            </p>
          )}

          {user?.uid === id && (
            <a href="#/edit-profile" className="block mt-4 text-[#E96F19] underline text-sm">
              Edit profile
            </a>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mt-10 text-center">
        <StatCard number={followers} label="Followers" color="#1662A6" />
        <StatCard number={following} label="Following" color="#E96F19" />
        <StatCard number={posts.length} label="Posts" color="#122944" />
      </div>

      {/* POSTS */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>

        {posts.length === 0 ? (
          <p className="text-gray-500">This user hasn’t posted anything yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <a
                key={p.id}
                href={`#/forum/${p.id}`}
                className="block p-4 border rounded-xl hover:bg-gray-50 transition"
              >
                <h4 className="font-semibold text-[#122944]">{p.title}</h4>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ number, label, color }) {
  return (
    <div
      className="rounded-xl py-6 shadow text-white"
      style={{ backgroundColor: color }}
    >
      <div className="text-3xl font-bold">{number}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}
