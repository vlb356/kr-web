import React from "react";

const DETAILS = {
  l1: {
    name:"Kaunas Padel League",
    desc:"Round-robin padel league for all levels. Matches on weeknights in Kaunas.",
    fixtures:[
      { round:1, a:"Team A", b:"Team B" },
      { round:1, a:"Team C", b:"Team D" },
    ]
  },
  l2: { name:"Vilnius Amateur Basket", desc:"Weekend games, 5v5, FIBA rules.", fixtures:[] },
  l3: { name:"Girstutis Volleyball Open", desc:"Co-ed 6v6 league at Girstutis.", fixtures:[] },
};

export default function LeagueDetail({ route, sub }) {
  const id = route.split("/").pop();
  const d = DETAILS[id];

  if (!d) return (
    <div className="kr-card">League not found.</div>
  );

  return (
    <div className="kr-space-y">
      <div className="kr-card">
        <div className="kr-row between">
          <div>
            <h2 className="kr-h2" style={{ margin: 0 }}>{d.name}</h2>
            <p className="kr-muted" style={{ marginTop: 8 }}>{d.desc}</p>
          </div>
          <span className="kr-badge">Season</span>
        </div>
        <div className="mt">
          <button
            className="kr-btn kr-btn--brand"
            onClick={() => alert(sub?.active ? "Joined!" : "Please subscribe first")}
          >
            {sub?.active ? "Join League" : "Subscribe to join"}
          </button>
        </div>
      </div>

      <div className="kr-card">
        <h3 className="kr-h3">Fixtures</h3>
        {d.fixtures.length === 0 ? (
          <div className="kr-muted">Fixtures will be published soon.</div>
        ) : (
          <ul className="kr-list">
            {d.fixtures.map((f,i) => <li key={i}>Round {f.round}: {f.a} vs {f.b}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
