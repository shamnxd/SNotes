"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.error || "Registration failed");
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
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#FA661A] flex items-center justify-center mb-4 border border-[#FFD5C0]">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#18181B] tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Start sharing encrypted notes securely
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#18181B] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FA661A] focus:ring-1 focus:ring-[#FA661A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18181B] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FA661A] focus:ring-1 focus:ring-[#FA661A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18181B] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FA661A] focus:ring-1 focus:ring-[#FA661A] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 px-4 bg-[#FA661A] hover:bg-[#E0530C] text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-[#6B7280]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#FA661A] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
