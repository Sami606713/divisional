"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { saveTokens, saveUserCredential } from "@/lib/auth";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const credentialRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const credential = credentialRef.current?.value?.trim() || "";
    const password = passRef.current?.value || "";
    if (!credential || !password) {
      setError("Please enter your roll number / email and password.");
      return;
    }
    setLoading(true);
    try {
      const { access_token, refresh_token, role, user_id, name } = await authApi.login(credential, password, "");
      saveTokens(access_token, refresh_token, role, user_id, name);
      saveUserCredential(credential);
      const roleRouteMap: Record<string, string> = {
        admin: "/admin",
        super_admin: "/admin",
        teacher: "/teacher",
        student: "/student",
        parent: "/parent",
      };
      router.push(roleRouteMap[role] ?? "/admin");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">DPHS Pharhala</p>
              <p className="text-xs text-gray-500">Haripur, KPK</p>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your school portal</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number / Email / Phone
              </label>
              <input
                ref={credentialRef}
                type="text"
                placeholder="e.g. 2025-0001 or admin@school.pk"
                autoComplete="username"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Students: use your roll number &nbsp;·&nbsp; Staff: use email or phone
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  ref={passRef}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Helper box for students */}
          <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-800 mb-1">For students</p>
            <p className="text-xs text-green-700">
              Your <span className="font-semibold">Roll Number</span> is printed on your admit card
              (e.g. <span className="font-mono font-semibold">2025-0001</span>).
              Your initial password is your B-Form number or as given by your teacher.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link href="/" className="text-green-600 hover:underline">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}
