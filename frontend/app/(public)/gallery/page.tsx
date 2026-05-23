"use client";
import { useState } from "react";
import { Camera } from "lucide-react";

const categories = ["All", "Events", "Sports", "Academics", "Campus"];

const photos = [
  { id: 1, title: "Annual Sports Day 2024", category: "Sports", color: "from-green-400 to-green-600" },
  { id: 2, title: "Science Exhibition", category: "Academics", color: "from-blue-400 to-blue-600" },
  { id: 3, title: "School Building", category: "Campus", color: "from-gray-400 to-gray-600" },
  { id: 4, title: "Prize Distribution Ceremony", category: "Events", color: "from-yellow-400 to-yellow-600" },
  { id: 5, title: "Football Match", category: "Sports", color: "from-orange-400 to-orange-600" },
  { id: 6, title: "Computer Lab", category: "Campus", color: "from-indigo-400 to-indigo-600" },
  { id: 7, title: "Classroom Session", category: "Academics", color: "from-teal-400 to-teal-600" },
  { id: 8, title: "School Library", category: "Campus", color: "from-pink-400 to-pink-600" },
  { id: 9, title: "Debate Competition", category: "Events", color: "from-purple-400 to-purple-600" },
  { id: 10, title: "Cricket Tournament", category: "Sports", color: "from-lime-400 to-lime-600" },
  { id: 11, title: "Science Lab", category: "Academics", color: "from-cyan-400 to-cyan-600" },
  { id: 12, title: "School Gate", category: "Campus", color: "from-rose-400 to-rose-600" },
];

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? photos : photos.filter((p) => p.category === active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Photo Gallery</h1>
        <p className="text-gray-500">Moments and memories from DPHS Pharhala</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${active === cat ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-green-50"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo) => (
          <div key={photo.id} className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`h-40 bg-gradient-to-br ${photo.color} flex items-center justify-center`}>
              <Camera className="w-8 h-8 text-white/70" />
            </div>
            <div className="bg-white p-3">
              <p className="text-sm font-medium text-gray-800 truncate">{photo.title}</p>
              <p className="text-xs text-gray-400">{photo.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
