import React, { useEffect, useMemo, useState } from "react";
import { addComment, listenComments, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Topic({ route, user }) {
  const topicId = useMemo(() => route.split("/")[2] || "", [route]);
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      if (!topicId) return;
      const ref = doc(db, "topics", topicId);
      const snap = await getDoc(ref);
      if (snap.exists()) setTopic({ id: topicId, ...snap.data() });
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

  if (!topicId) return null;

  return (
    <div className="kr-space-y">
      <a href="#/social" className="kr-link">← Back to forum</a>

      <div className="kr-card">
        <div className="kr-muted" style={{fontSize:12}}>{topic?.tag}</div>
        <h1 className="kr-h2">{topic?.title || "Topic"}</h1>
      </div>

      <div className="kr-card">
        <h2 className="kr-h4">Comments</h2>

        <form onSubmit={onSend} className="kr-row">
          <input className="kr-input kr-grow" placeholder="Write a message…"
            value={msg} onChange={(e) => setMsg(e.target.value)} />
          <button className="kr-btn kr-btn--brand">Send</button>
        </form>

        <div style={{marginTop:10}}>
          {comments.map((c) => (
            <div key={c.id} style={{padding:"8px 0", borderTop:"1px solid var(--kr-border)"}}>
              <div style={{fontWeight:600, fontSize:14}}>{c.name}</div>
              <div style={{fontSize:14}}>{c.text}</div>
            </div>
          ))}
          {comments.length === 0 && <div className="kr-muted">No comments yet.</div>}
        </div>
      </div>
    </div>
  );
}
