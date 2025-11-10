import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function Leagues() {
  // ---- Form state ----
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [level, setLevel] = useState("All levels");
  const [type, setType] = useState("League");
  const [shortDesc, setShortDesc] = useState("");

  // ---- List state ----
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ---- Live list from Firestore ----
  useEffect(() => {
    const q = query(collection(db, "leagues"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLeagues(rows);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setErrorMsg("Could not load leagues right now.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // ---- Create league/tournament ----
  async function handleCreate(e) {
    e.preventDefault();
    setErrorMsg("");

    const t = title.trim();
    const c = city.trim();
    const d = shortDesc.trim();

    if (!t) {
      setErrorMsg("Please add a title.");
      return;
    }
    try {
      setCreating(true);
      await addDoc(collection(db, "leagues"), {
        title: t,
        city: c || null,
        level: level || "All levels",
        type: type || "League",
        description: d || null,
        ownerUid: auth.currentUser?.uid ?? null,
        ownerName:
          auth.currentUser?.displayName ??
          auth.currentUser?.email ??
          "Anonymous",
        createdAt: serverTimestamp(),
        players: [],
        status: "open",
      });

      // reset form
      setTitle("");
      setCity("");
      setLevel("All levels");
      setType("League");
      setShortDesc("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not create. Try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-8">
        <div className="rounded-2xl p-8 md:p-10 bg-gradient-to-r from-indigo-400 via-purple-500 to-slate-800 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold">
            Leagues & Tournaments
          </h1>
          <p className="mt-2 opacity-90">
            Join a season, compete on weekends, or start your own bracket.
          </p>
        </div>

        {/* CREATE BAR */}
        <form
          onSubmit={handleCreate}
          className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-6"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="md:col-span-2 rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-400"
            placeholder="Title (e.g., Kaunas Winter Padel)"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-400"
            placeholder="City"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-400"
          >
            <option>All levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-400"
          >
            <option>League</option>
            <option>Tournament</option>
          </select>
          <button
            disabled={creating}
            className="rounded-lg bg-gray-900 text-white px-4 py-2 font-medium hover:bg-gray-800 active:scale-[0.99] disabled:opacity-60"
          >
            {creating ? "Creating…" : "Create"}
          </button>
          <input
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="md:col-span-6 rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-400"
            placeholder="Short description (e.g., Round-robin on weeknights…)"
          />
        </form>

        {errorMsg && (
          <div className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* LIST */}
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Open brackets</h2>

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              Loading…
            </div>
          ) : leagues.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
              Nothing here yet. Be the first to create a league or tournament.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {leagues.map((lg) => {
                const badge = (lg.type ?? "League"); // << sin mezclar ?? y ||
                const lvl = lg.level ?? "All levels"; // << idem
                const cityLabel = lg.city ?? "—";

                return (
                  <div
                    key={lg.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-xs font-medium">
                        {badge}
                      </span>
                      <span className="text-xs text-gray-500">
                        {cityLabel} · {lvl}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-gray-900">
                      {lg.title ?? "Untitled"}
                    </h3>
                    {lg.description ? (
                      <p className="mt-1 text-sm text-gray-600">
                        {lg.description}
                      </p>
                    ) : null}

                    <div className="mt-4 flex items-center gap-2">
                      {/* Usamos <a> para evitar depender del Router */}
                      <a
                        href={`#/league/${lg.id}`}
                        className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                        onClick={() => alert("Join coming soon")}
                      >
                        Join
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

