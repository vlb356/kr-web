// src/features/social/Topic.jsx
import React, { useEffect, useMemo, useState } from "react";
import { addComment, listenComments, deleteComment, db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";

export default function Topic() {
  const { id: topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");

  const currentUid = auth.currentUser?.uid || "";

  // Load topic information
  useEffect(() => {
    let unsub = () => { };

    (async () => {
      if (!topicId) return;

      const ref = doc(db, "topics", topicId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTopic({ id: topicId, ...snap.data() });
      }

      // Start listening to comments
      unsub = listenComments(topicId, setComments);
    })();

    return () => unsub();
  }, [topicId]);

  async function onSend(e) {
    e.preventDefault();
    if (!msg.trim()) return;

    try {
      await addComment(topicId, msg.trim());
      setMsg("");
    } catch (e) {
      alert(e.message);
    }
  }

  async function onDeleteComment(commentId) {
    const ok = confirm("Delete this comment?");
    if (!ok) return;
    await deleteComment(topicId, commentId);
  }

  if (!topicId) return null;

  return (
    <div className="kr-space-y">
      <Link to="/social" className="kr-link">← Back to forum</Link>

      {/* TOPIC HEADER */}
      <div className="kr-card">
        <div className="kr-muted" style={{ fontSize: 12 }}>{topic?.tag}</div>
        <h1 className="kr-h2">{topic?.title || "Topic"}</h1>
      </div>

      {/* COMMENTS */}
      <div className="kr-card">
        <h2 className="kr-h4">Comments</h2>

        <form onSubmit={onSend} className="kr-row">
          <input
            className="kr-input kr-grow"
            placeholder="Write a message…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button className="kr-btn kr-btn--brand">Send</button>
        </form>

        <div style={{ marginTop: 10 }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: "8px 0",
                borderTop: "1px solid var(--kr-border)",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
              <div style={{ fontSize: 14 }}>{c.text}</div>

              {/* DELETE BUTTON — Only For Owner */}
              {c.uid === currentUid && (
                <button
                  onClick={() => onDeleteComment(c.id)}
                  className="text-red-600 text-xs mt-1 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {comments.length === 0 && (
            <div className="kr-muted">No comments yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
