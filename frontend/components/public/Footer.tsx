import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { SCHOOL_ADDRESS, SCHOOL_PHONE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">DPHS Pharhala</p>
                <p className="text-xs text-gray-400">Haripur, KPK</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Providing quality education to the students of Pharhala, Haripur since 1985.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[["About", "/about"], ["Admissions", "/admissions"], ["Results", "/results"], ["Contact", "/contact"]].map(([label, href]) => (
                <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-green-400 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                <span className="break-words">{SCHOOL_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 shrink-0 text-green-500" />
                <span className="break-all">{SCHOOL_PHONE}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 shrink-0 text-green-500" />
                <span className="break-all">info@dphs-pharhala.edu.pk</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © 2025 Divisional Public High School Pharhala. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
