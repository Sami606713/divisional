"use client";
import { useQuery } from "@tanstack/react-query";
import { studentsApi, FeeRecordOut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CheckCircle, Clock } from "lucide-react";

export default function StudentFeesPage() {
  const { data: me, isLoading: loadingMe } = useQuery({
    queryKey: ["student-me"],
    queryFn: () => studentsApi.me(),
  });

  const { data: fees = [], isLoading: loadingFees } = useQuery<FeeRecordOut[]>({
    queryKey: ["my-fees", me?.id],
    queryFn: () => studentsApi.getFees(me!.id),
    enabled: !!me?.id,
  });

  const isLoading = loadingMe || loadingFees;
  const paidCount   = fees.filter((f) => f.status === "paid").length;
  const pendingCount = fees.filter((f) => f.status !== "paid").length;
  const totalPaid   = fees.reduce((a, f) => a + f.paid_amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Fee Status</h1>
        <p className="text-gray-500 text-sm mt-1">
          {me ? `Roll No: ${me.roll_number}` : "Fee payment history"}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
          </div>
          <div className="h-48 bg-gray-100 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Paid",       value: String(paidCount),                    icon: CheckCircle, color: "text-green-600 bg-green-50" },
              { label: "Pending",    value: String(pendingCount),                  icon: Clock,       color: "text-yellow-600 bg-yellow-50" },
              { label: "Total Paid", value: `Rs. ${totalPaid.toLocaleString()}`,   icon: DollarSign,  color: "text-blue-600 bg-blue-50" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Fee Payment History</h2>
            </div>
            {fees.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No fee records found yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Month", "Type", "Net Amount", "Paid", "Status", "Due Date", "Paid Date"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fees.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{f.month}</td>
                        <td className="px-4 py-3 text-gray-600">{f.fee_type}</td>
                        <td className="px-4 py-3 text-gray-900">Rs. {f.net_amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-900">Rs. {f.paid_amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Badge variant={f.status === "paid" ? "success" : f.status === "overdue" ? "danger" : "warning"}>
                            {f.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {f.due_date ? new Date(f.due_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {f.paid_date ? new Date(f.paid_date).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
