import { GraduationCap, Target, Eye, Award, CheckCircle } from "lucide-react";

import { SCHOOL_ADDRESS } from "@/lib/site";

export const metadata = {
  title: "About Us | DPHS Pharhala",
  description: "Learn about Divisional Public High School Pharhala, Haripur — our history, mission, and vision.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">About Our School</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Learn about our history, mission, and commitment to educational excellence in Pharhala, Haripur.</p>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-green-600" /> Our History
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Divisional Public High School Pharhala was established in 1985 with a vision to provide quality secondary education to the students of Pharhala and surrounding areas in Haripur district, Khyber Pakhtunkhwa.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Over the past four decades, the school has grown from a small institution to a well-established educational center with over 320 students and 18 dedicated teachers. The school is affiliated with the Board of Intermediate and Secondary Education (BISE) Abbottabad.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Located at {SCHOOL_ADDRESS}, the school serves students from Classes 9 and 10 and has consistently maintained a high pass rate in board examinations.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 rounded-2xl border border-green-100 p-8">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To provide high-quality, affordable secondary education that empowers students with knowledge, skills, and values needed to excel in life, contribute to society, and serve Pakistan with excellence and integrity.
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-8">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be the leading educational institution in Haripur district, recognized for academic excellence, character development, and producing graduates who are confident, responsible, and ready to face the challenges of the modern world.
          </p>
        </div>
      </div>

      {/* Principal Message */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Principal&apos;s Message</h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 leading-relaxed mb-4">
              &ldquo;Dear students, parents, and visitors, it is with great pride and humility that I welcome you to Divisional Public High School Pharhala. Our institution stands on the pillars of academic excellence, moral integrity, and community service.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe every student has unique potential, and our dedicated team of teachers works tirelessly to nurture and develop that potential. Our goal is not just to prepare students for examinations, but to shape them into responsible citizens who will contribute positively to society.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              I invite all parents to partner with us in this noble endeavor of education. Together, we can build a brighter future for our children and our community.&rdquo;
            </p>
            <p className="font-semibold text-gray-900">Principal</p>
            <p className="text-sm text-gray-500">Divisional Public High School, Pharhala</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" /> Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "94% Pass Rate in BISE Abbottabad Annual Examinations 2024",
            "Best School Award — Haripur District Education Department 2023",
            "Won Inter-School Debate Competition 2024 — First Position",
            "100% Result in Board Examinations for 3 consecutive years",
            "Successful launch of Computer Science program 2022",
            "Over 2,000 graduates since establishment in 1985",
            "Fully equipped science and computer laboratories",
            "Active sports program with district-level achievements",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-gray-600 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
