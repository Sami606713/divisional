import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const pendingAdmissions = [
  { id: 1, name: "Hamza Rehman", father: "Abdul Rehman", class: "9", phone: "0311-1234567", date: "2025-05-18", status: "Pending" },
  { id: 2, name: "Hina Bashir", father: "Muhammad Bashir", class: "9", phone: "0322-2345678", date: "2025-05-17", status: "Pending" },
  { id: 3, name: "Saad Ahmed", father: "Zahid Ahmed", class: "10", phone: "0333-3456789", date: "2025-05-16", status: "Reviewing" },
  { id: 4, name: "Aisha Malik", father: "Tariq Malik", class: "10", phone: "0344-4567890", date: "2025-05-15", status: "Pending" },
  { id: 5, name: "Omar Farooq", father: "Farooq Ahmed", class: "9", phone: "0300-5678901", date: "2025-05-14", status: "Approved" },
];

export default function AdminAdmissionsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage student admission applications</p>
        </div>
        <div className="flex gap-3">
          {[["Pending", "bg-yellow-100 text-yellow-800", 3], ["Reviewing", "bg-blue-100 text-blue-800", 1], ["Approved", "bg-green-100 text-green-800", 1]].map(([label, cls, count]) => (
            <span key={label as string} className={`px-3 py-1.5 rounded-full text-xs font-medium ${cls}`}>{count} {label}</span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Student Name", "Father's Name", "Class", "Phone", "Applied On", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingAdmissions.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                <td className="px-4 py-3 text-gray-600">{a.father}</td>
                <td className="px-4 py-3"><Badge variant="default">Class {a.class}</Badge></td>
                <td className="px-4 py-3 text-gray-600">{a.phone}</td>
                <td className="px-4 py-3 text-gray-500">{a.date}</td>
                <td className="px-4 py-3">
                  <Badge variant={a.status === "Approved" ? "success" : a.status === "Reviewing" ? "info" : "warning"}>
                    {a.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {a.status !== "Approved" && (
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                  {a.status === "Approved" && <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />Processed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
