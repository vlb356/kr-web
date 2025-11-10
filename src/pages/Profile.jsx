import React, { useEffect, useMemo, useState } from "react";
import { listenUserPosts } from "../lib/social";

export default function Profile({ route, user }) {
  const targetUid = useMemo(() => {
    if (route === "/profile" || route === "/profile/me") return user?.uid || "";
    if (route.startsWith("/profile/")) return route.split("/")[2] || "";
    return "";
  }, [route, user]);

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

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div className="kr-space-y">
      <div className="kr-card kr-profile-header">
        <div className="kr-avatar">{initial}</div>
        <div>
          <h2 style={{ margin: 0 }}>{user?.name || user?.email || "User"}</h2>
          <div className="kr-muted">{posts.length} posts</div>
        </div>
      </div>

      <div className="kr-grid-tiles">
        {posts.map((p) => (
          <div key={p.id} className="kr-tile">
            <img src={p.imageUrl} alt={p.caption || ""} />
          </div>
        ))}
        {posts.length === 0 && (
          <div className="kr-card"><p className="kr-muted">No posts yet.</p></div>
        )}
      </div>
    </div>
  );
}
