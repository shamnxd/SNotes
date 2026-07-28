"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white dark:bg-[#151D2A] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F8F2] dark:bg-[#00C48C]/20 text-[#00C48C] flex items-center justify-center mb-4 border border-[#A7F3D0] dark:border-[#00C48C]/30">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sign in to manage your secure notes
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#00C48C] focus:ring-1 focus:ring-[#00C48C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#00C48C] focus:ring-1 focus:ring-[#00C48C] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 px-4 bg-[#00C48C] hover:bg-[#00A876] text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#00C48C] hover:underline"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
