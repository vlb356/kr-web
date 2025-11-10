import React, { useMemo, useState } from "react";

/** Datos mock (puedes ampliar cuando quieras) */
const VENUES = [
  { name: "LemonGym Akropolis", city: "Kaunas", type: "Gym & Fitness", perks: ["24/7", "Sauna", "Group Classes"], hue: 18 },
  { name: "VDU Sporto Centras", city: "Kaunas", type: "University Sports", perks: ["Basketball courts", "Volleyball", "Badminton"], hue: 210 },
  { name: "Kauno Žalgirio Arena Courts", city: "Kaunas", type: "Indoor Courts", perks: ["Basketball x4", "Futsal", "Table-tennis"], hue: 265 },
  { name: "Vilniaus Universitetas Sporto Rūmai", city: "Vilnius", type: "University Sports", perks: ["Volleyball", "Fitness rooms", "Running track"], hue: 175 },
  { name: "Impuls Fabijoniškės", city: "Vilnius", type: "Gym & Pool", perks: ["Pool", "Spa", "Cycling classes"], hue: 195 },
  { name: "Klaipėda Seaside Courts", city: "Klaipėda", type: "Outdoor", perks: ["Beach Volleyball", "Streetball", "Calisthenics"], hue: 35 },
  { name: "Nida Sport Base", city: "Nida", type: "Outdoor & Indoor", perks: ["Tennis", "Football 7", "Volleyball"], hue: 12 },
  { name: "Šiauliai Arena Training", city: "Šiauliai", type: "Courts", perks: ["Basketball x3", "Volley x2"], hue: 335 },
  { name: "Panevėžys Multi-Sport", city: "Panevėžys", type: "Multi-venue", perks: ["Table-tennis", "Gym", "Badminton"], hue: 150 },
  { name: "Kaunas Padeliui (Padel Club)", city: "Kaunas", type: "Padel", perks: ["4 indoor courts", "Racket rental"], hue: 25 },
  { name: "Vilnius Padel House", city: "Vilnius", type: "Padel", perks: ["6 indoor courts", "Leagues"], hue: 14 },
  { name: "Kaunas Volleyball House", city: "Kaunas", type: "Volleyball", perks: ["3 indoor courts", "Weekend tournaments"], hue: 220 },
];

/** UI helpers */
const cx = (...c) => c.filter(Boolean).join(" ");
const Chip = ({ children, className = "" }) => (
  <span className={cx("text-xs px-2 py-1 rounded-full bg-gray-100", className)}>{children}</span>
);

export default function Explore() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");
  const [kind, setKind] = useState("All");

  const cities = useMemo(() => ["All", ...Array.from(new Set(VENUES.map(v => v.city)))], []);
  const kinds  = useMemo(() => ["All", ...Array.from(new Set(VENUES.map(v => v.type)))], []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return VENUES.filter(v => {
      const okText = !s || `${v.name} ${v.city} ${v.type} ${v.perks.join(" ")}`.toLowerCase().includes(s);
      const okCity = city === "All" || v.city === city;
      const okKind = kind === "All" || v.type === kind;
      return okText && okCity && okKind;
    });
  }, [q, city, kind]);

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="kr-card-lg p-0 overflow-hidden">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-kr-blue/80 via-kr-orange/80 to-kr-navy/80"></div>
        <div className="-mt-10 sm:-mt-12 px-5 sm:px-8 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Explore venues in Lithuania</h1>
          <p className="text-sm text-gray-600 mt-1">Pick a venue, join a game, or start your own.</p>

          {/* Filtros */}
          <div className="mt-4 grid gap-2 sm:grid-cols-5">
            <input
              className="sm:col-span-3 border rounded-xl px-3 py-2 w-full"
              placeholder="Search by venue, sport, city…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="border rounded-xl px-3 py-2" value={city} onChange={(e)=>setCity(e.target.value)}>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border rounded-xl px-3 py-2" value={kind} onChange={(e)=>setKind(e.target.value)}>
              {kinds.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* GRID de tarjetas */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((v, i) => {
          // Encabezado con degradado según 'hue'
          const headerStyle = {
            background: `linear-gradient(135deg, hsl(${v.hue} 90% 55%) 0%, hsl(${v.hue} 85% 45%) 100%)`,
          };
          const initials = v.name.split(" ").slice(0,2).map(s => s[0]).join("").toUpperCase();

          return (
            <div key={i} className="kr-card p-0 overflow-hidden group hover:shadow-card transition">
              {/* Header “visual” */}
              <div className="relative h-36" style={headerStyle}>
                <div className="absolute inset-0/ w-full h-full opacity-15 mix-blend-luminosity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/90 text-5xl font-black tracking-widest drop-shadow-sm select-none">
                    {initials}
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Chip className="bg-white/90">{v.type}</Chip>
                </div>
              </div>

              {/* Cuerpo */}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{v.name}</h3>
                  <Chip className="bg-gray-50">{v.city}</Chip>
                </div>

                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  {v.perks.slice(0,3).map((p, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-kr-blue" />
                      <span>{p}</span>
                    </li>
                  ))}
                  {v.perks.length > 3 && (
                    <li className="text-xs text-gray-500">+{v.perks.length - 3} more</li>
                  )}
                </ul>

                <div className="mt-4 flex items-center justify-between">
                  <a
                    href="#/events"
                    className="kr-btn-primary"
                  >
                    See games here
                  </a>
                  <div className="text-xs text-gray-400 group-hover:text-gray-500 transition">
                    One Pass access
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className="kr-card col-span-full text-sm text-gray-500">
            No venues matched your filters.
          </div>
        )}
      </div>
    </div>
  );
}
