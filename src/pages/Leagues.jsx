import React from "react";

const LEAGUES = [
  { id: "l1", name: "Kaunas Padel League", city: "Kaunas", level: "All levels", desc: "Round-robin padel league · weeknights" },
  { id: "l2", name: "Vilnius Amateur Basket", city: "Vilnius", level: "Amateur", desc: "Weekend games, 5v5, FIBA rules" },
  { id: "l3", name: "Girstutis Volleyball Open", city: "Kaunas", level: "Co-ed", desc: "6v6 league at Girstutis" },
];

export default function Leagues() {
  return (
    <div className="kr-space-y">
      <h1 className="kr-h2">Leagues & Tournaments</h1>
      <div className="kr-grid-3">
        {LEAGUES.map(l => (
          <div key={l.id} className="kr-card">
            <div className="kr-row between">
              <div>
                <div className="kr-h4" style={{ margin: 0 }}>{l.name}</div>
                <div className="kr-muted">{l.city} · {l.level}</div>
                <div className="kr-muted" style={{ marginTop: 6 }}>{l.desc}</div>
              </div>
              <span className="kr-badge">Season</span>
            </div>
            <div className="kr-row end mt">
              <a href={`#/league/${l.id}`} className="kr-btn kr-btn--brand">View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
