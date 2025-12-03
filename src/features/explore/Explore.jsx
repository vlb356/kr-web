// src/features/explore/Explore.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Card, Badge, Input, Container } from "@/components/ui";
import { venuesData } from "./venuesData";

export default function Explore() {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Gym",
    "Padel",
    "Football",
    "Swimming",
    "Basketball",
    "Yoga",
  ];

  // Load local venues data
  useEffect(() => {
    setVenues(venuesData);
  }, []);

  // Filter venues by search + category
  const filtered = useMemo(() => {
    return venues.filter((v) => {
      const matchesSearch = v.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || v.type === category;
      return matchesSearch && matchesCategory;
    });
  }, [venues, search, category]);

  return (
    <Container>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Venues</h1>
        <p className="text-gray-600">
          All gyms, courts and sports facilities included in your KR One Pass.
        </p>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${category === c
                ? "bg-gray-900 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search venues…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8"
      />

      {/* RESULTS */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No venues found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => (
            <Card
              key={v.id}
              padding="md"
              className="hover:shadow-md transition"
            >
              <div className="mb-3">
                <img
                  src={v.image}
                  alt={v.name}
                  className="h-40 w-full object-cover rounded-xl"
                />
              </div>

              <h3 className="text-lg font-bold">{v.name}</h3>
              <p className="text-gray-600 text-sm">{v.city}</p>
              <p className="text-gray-500 text-sm mt-1">
                {v.address}
              </p>

              <Badge variant="blue" className="mt-3">
                {v.type}
              </Badge>

              <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                {v.description}
              </p>

              {v.features && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {v.features.map((f, i) => (
                    <Badge variant="gray" key={i}>
                      {f}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
