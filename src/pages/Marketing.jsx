import React from "react";

export default function Marketing() {
  return (
    <>
      <section className="kr-card kr-hero">
        <div className="max-w-3xl">
          <div className="kr-kicker">One Pass</div>
          <h1 className="kr-h1">One subscription.<br/>All sports in your city.</h1>
          <p className="kr-muted kr-lead">
            Access gyms, university facilities and private venues with a single plan.
            Create or join games, meet people and compete in leagues.
          </p>
          <div className="kr-row mt">
            <a href="#/explore" className="kr-btn kr-btn--brand">Get started</a>
            <a href="#/subscribe" className="kr-btn">See what's included</a>
          </div>
        </div>
      </section>

      <div className="kr-card mt">
        <h2 className="kr-h3">What's inside?</h2>
        <ul className="kr-list">
          <li>Multi-venue access (gyms + universities + private courts)</li>
          <li>Events: create games and book courts</li>
          <li>Local leagues & tournaments</li>
          <li>Social forum</li>
        </ul>
      </div>
    </>
  );
}
