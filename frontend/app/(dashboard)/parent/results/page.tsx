"use client";

export default function ParentResultsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Child&apos;s Results</h1>
        <p className="text-gray-500 text-sm mt-1">Academic results</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <p className="text-blue-700 font-medium">Contact the school admin to link your child&apos;s account.</p>
        <p className="text-sm text-blue-600 mt-1">Once your child&apos;s account is linked, results will appear here.</p>
      </div>
    </div>
  );
}
