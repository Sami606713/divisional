import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SCHOOL_ADDRESS, SCHOOL_MAP_EMBED_SRC, SCHOOL_MAP_LINK, SCHOOL_PHONE } from "@/lib/site";

export const metadata = { title: "Contact Us | DPHS Pharhala" };

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-500">Get in touch with DPHS Pharhala</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">School Information</h2>
            <div className="space-y-4">
              {[
                { icon: MapPin, label: "Address", value: SCHOOL_ADDRESS, color: "text-green-600 bg-green-50" },
                { icon: Phone, label: "Phone", value: SCHOOL_PHONE, color: "text-blue-600 bg-blue-50" },
                { icon: Mail, label: "Email", value: "info@dphs-pharhala.edu.pk", color: "text-purple-600 bg-purple-50" },
                { icon: Clock, label: "Office Hours", value: "Saturday to Thursday: 8:00 AM – 2:00 PM", color: "text-yellow-600 bg-yellow-50" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="text-gray-800 text-sm mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              title="Divisional Public High School Pharhala contact map"
              src={SCHOOL_MAP_EMBED_SRC}
              width="100%"
              height="320"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
          <div>
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

        {/* Contact Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Send a Message</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Your Name</label>
                <input type="text" placeholder="Full Name" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                <input type="tel" placeholder="0300-0000000" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
              <input type="email" placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Select Subject</option>
                <option>Admission Inquiry</option>
                <option>Fee Information</option>
                <option>General Inquiry</option>
                <option>Complaint</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
              <textarea rows={5} placeholder="Write your message here..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
