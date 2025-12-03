// src/features/profile/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { listenUserPosts } from "@/lib/social";
import { useParams } from "react-router-dom";
import { auth } from "@/lib/firebase";

export default function Profile() {
  const { uid } = useParams();
  const currentUser = auth.currentUser;

  // Determine which profile to show
  const targetUid = useMemo(() => {
    if (uid) return uid;
    return currentUser?.uid || "";
  }, [uid, currentUser]);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!targetUid) return;

    const unsub = listenUserPosts(targetUid, setPosts);
    return () => unsub && unsub();
  }, [targetUid]);

  if (!targetUid) {
    return (
      <div className="kr-card">
        <p className="kr-muted">Sign in to see your profile.</p>
      </div>
    );
  }

  const initial = (
    currentUser?.name ||
    currentUser?.email ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div className="kr-space-y">
      {/* HEADER */}
      <div className="kr-card kr-profile-header">
        <div className="kr-avatar">{initial}</div>
        <div>
          <h2 style={{ margin: 0 }}>
            {currentUser?.name || currentUser?.email || "User"}
          </h2>
          <div className="kr-muted">{posts.length} posts</div>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="kr-grid-tiles">
        {posts.map((p) => (
          <div key={p.id} className="kr-tile">
            <img src={p.imageUrl} alt={p.caption || ""} />
          </div>
        ))}

        {posts.length === 0 && (
          <div className="kr-card">
            <p className="kr-muted">No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
