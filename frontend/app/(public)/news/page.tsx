import { news } from "@/lib/data";
import { Calendar, Tag } from "lucide-react";

export const metadata = { title: "News & Events | DPHS Pharhala" };

const categoryColors: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-700",
  Sports: "bg-green-100 text-green-700",
  Infrastructure: "bg-purple-100 text-purple-700",
  Events: "bg-yellow-100 text-yellow-700",
  Achievement: "bg-red-100 text-red-700",
};

export default function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">News & Events</h1>
        <p className="text-gray-500">Latest news and announcements from DPHS Pharhala</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <article key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-44 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{item.date.split("-")[2]}</div>
                <div className="text-sm text-green-500">{new Date(item.date).toLocaleString("default", { month: "long", year: "numeric" })}</div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${categoryColors[item.category] || "bg-gray-100 text-gray-700"}`}>
                  <Tag className="w-3 h-3" />{item.category}
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-3">{item.excerpt}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-4">
                <Calendar className="w-3 h-3" />{item.date}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
