"use client";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Save, ShieldCheck, UserCircle2 } from "lucide-react";

function roleLabel(role: string) {
  if (role === "admin" || role === "super_admin") return "School Administrator";
  if (role === "teacher") return "Teacher";
  if (role === "student") return "Student";
  return "Parent / Guardian";
}

export function SettingsPage({ role }: { role: string }) {
  const canChangePassword = role === "admin" || role === "super_admin" || role === "teacher";
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userName = typeof window !== "undefined" ? (localStorage.getItem("user_name") ?? "User") : "User";
  const userId = typeof window !== "undefined" ? (localStorage.getItem("user_id") ?? "—") : "—";
  const displayRole = useMemo(() => roleLabel(role), [role]);

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: () => authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setSuccess("Password updated successfully.");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: unknown) => {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : Array.isArray(detail) ? detail[0]?.msg ?? "Failed to update password." : "Failed to update password.");
      setSuccess("");
    },
  });

  const submit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      setSuccess("");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      setSuccess("");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setSuccess("");
      return;
    }
    changePassword();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account details and update your password.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
              <UserCircle2 className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Account Overview</h2>
              <p className="text-sm text-gray-500">Basic identity details for the current session.</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Display Name</span>
              <span className="font-medium text-gray-900">{userName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Role</span>
              <Badge variant="info">{displayRole}</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500">User ID</span>
              <span className="font-mono text-xs text-gray-600 break-all text-right max-w-[60%]">{userId}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">
                {canChangePassword ? "Change your login password for this account." : "Password changes are managed by school staff for this account."}
              </p>
            </div>
          </div>

          {canChangePassword ? (
            <>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
              {success && <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg mb-3">{success}</p>}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  onClick={submit}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? "Updating..." : "Update Password"}
                </button>
              </div>

              <div className="mt-5 flex items-start gap-2 text-xs text-gray-500">
                <KeyRound className="w-4 h-4 mt-0.5 text-gray-400" />
                <p>Use a strong password with at least 8 characters. After a successful change, your current session stays active.</p>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Students cannot change their password from this panel. Please contact the administrator or teacher if your password needs to be reset.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
