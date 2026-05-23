import { CheckCircle, FileText, AlertCircle } from "lucide-react";

export const metadata = { title: "Admissions | DPHS Pharhala" };

export default function AdmissionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Admissions 2025</h1>
        <p className="text-gray-500">Admissions are open for Class 9 and Class 10 for the session 2025-2026.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" /> Eligibility Criteria
            </h2>
            <div className="space-y-3">
              {[
                "Passed Class 8 from a recognized institution",
                "Age between 13–17 years for Class 9",
                "Passed Class 9 from BISE Abbottabad for Class 10",
                "Original mark sheet / passing certificate from previous school",
                "Pakistani nationality (CNIC / B-Form required)",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Required Documents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Original Result Card / Mark Sheet",
                "School Leaving Certificate",
                "4 recent passport-size photographs",
                "Copy of B-Form / CNIC",
                "Father/Guardian CNIC copy",
                "Character Certificate from previous school",
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">{doc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Structure */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Fee Structure 2025–2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-tl-lg">Fee Type</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700">Class 9</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 rounded-tr-lg">Class 10</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Admission Fee (one-time)", "Rs. 2,000", "Rs. 2,000"],
                    ["Monthly Tuition Fee", "Rs. 800", "Rs. 900"],
                    ["Annual Fund", "Rs. 500", "Rs. 500"],
                    ["Exam Fee (per exam)", "Rs. 300", "Rs. 300"],
                    ["Library Fee (annual)", "Rs. 200", "Rs. 200"],
                    ["Sports Fee (annual)", "Rs. 150", "Rs. 150"],
                  ].map(([type, c9, c10]) => (
                    <tr key={type} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{type}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium">{c9}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium">{c10}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-green-600 rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-3">Admissions Open</h3>
            <p className="text-green-100 text-sm mb-4">Session 2025–2026 admissions are now open. Limited seats available.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-green-200">Start Date:</span><span>June 1, 2025</span></div>
              <div className="flex justify-between"><span className="text-green-200">Last Date:</span><span>July 31, 2025</span></div>
              <div className="flex justify-between"><span className="text-green-200">Classes:</span><span>9 & 10</span></div>
              <div className="flex justify-between"><span className="text-green-200">Available Seats:</span><span>80</span></div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Important Note</h3>
            </div>
            <p className="text-yellow-700 text-sm">Please bring all original documents along with photocopies. Incomplete applications will not be processed.</p>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Admission Inquiry</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Student Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="Father's Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="tel" placeholder="Phone Number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Select Class</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </select>
              <button className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                Submit Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
