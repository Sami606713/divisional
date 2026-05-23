import Link from "next/link";
import { news } from "@/lib/data";
import { SCHOOL_ADDRESS, SCHOOL_MAP_EMBED_SRC, SCHOOL_MAP_LINK, SCHOOL_PHONE } from "@/lib/site";
import { GraduationCap, Users, BookOpen, Award, MapPin, Phone, ChevronRight, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 px-4 py-16 text-white sm:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-green-500/30 px-4 py-1.5 text-xs sm:text-sm">
            <Star className="w-4 h-4" />
            <span>Established 1985 — Haripur, KPK</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl md:text-5xl">Divisional Public High School</h1>
          <p className="mb-2 text-base text-green-100 sm:text-lg">Pharhala, Haripur, KPK — Affiliated with BISE Abbottabad</p>
          <p className="mx-auto mb-10 max-w-2xl text-sm text-green-200 sm:text-base">Providing quality secondary education to the students of Pharhala and surrounding areas since 1985. Shaping futures with knowledge and character.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/admissions" className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
              Apply for Admission
            </Link>
            <Link href="/about" className="border border-white/50 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 md:grid-cols-4 sm:gap-6">
            {[
              { value: "320+", label: "Students", icon: Users, color: "text-green-600" },
              { value: "18", label: "Teachers", icon: GraduationCap, color: "text-blue-600" },
              { value: "12", label: "Classes", icon: BookOpen, color: "text-purple-600" },
              { value: "40+", label: "Years of Excellence", icon: Award, color: "text-yellow-600" },
            ].map(({ value, label, icon: Icon, color }) => (
              <div key={label}>
                <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="bg-gray-50 px-4 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:flex-row md:gap-8 md:p-12">
            <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-16 h-16 text-green-600" />
            </div>
            <div>
              <p className="text-green-600 font-semibold text-sm mb-1">Principal&apos;s Message</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to DPHS Pharhala</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                It is my privilege to welcome you to Divisional Public High School Pharhala. Our school has been a beacon of quality education in Haripur district for over four decades. We are committed to nurturing young minds and developing well-rounded individuals who will serve the community and nation with excellence.
              </p>
              <p className="text-gray-500 text-sm">— Principal, DPHS Pharhala</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="px-4 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Latest News & Events</h2>
              <p className="text-gray-500 text-sm mt-1">Stay updated with school activities</p>
            </div>
            <Link href="/news" className="flex items-center gap-1 text-green-600 text-sm font-medium hover:text-green-700">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-green-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">{item.category}</span>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-3">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-green-600 px-4 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Quick Links</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { label: "Admissions", href: "/admissions", desc: "Apply for Class 9 & 10" },
              { label: "Results", href: "/results", desc: "Check exam results" },
              { label: "Faculty", href: "/faculty", desc: "Meet our teachers" },
              { label: "Contact", href: "/contact", desc: "Get in touch" },
            ].map(({ label, href, desc }) => (
              <Link key={href} href={href} className="bg-white/10 hover:bg-white/20 rounded-xl p-5 text-white transition-colors">
                <p className="font-semibold">{label}</p>
                <p className="text-green-100 text-sm mt-1">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white px-4 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Us</h2>
          <div className="mb-2 flex flex-col items-center justify-center gap-2 text-gray-600 sm:flex-row">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="break-words">{SCHOOL_ADDRESS}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Phone className="w-5 h-5 text-green-600" />
            <span>{SCHOOL_PHONE}</span>
          </div>
          <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              title="Divisional Public High School Pharhala location map"
              src={SCHOOL_MAP_EMBED_SRC}
              width="100%"
              height="360"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
          <div className="mt-4">
            <a
              href={SCHOOL_MAP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
            >
              <MapPin className="w-4 h-4" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
