"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Zap,
  Eye,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* LEFT SIDE — Content & Branding Showcase */}
      <div className="w-full md:w-1/2 lg:w-7/12 bg-gradient-to-br from-[#062c21] via-[#0b1713] to-[#041a14] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00C48C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#00C48C]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00C48C] flex items-center justify-center text-white font-bold shadow-md">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-[#00C48C] leading-none">
                SecureNote
              </div>
              <div className="text-[10px] font-medium text-emerald-300/70 tracking-wider uppercase mt-0.5">
                Digital Serenity
              </div>
            </div>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-200" />
            )}
          </button>
        </div>

        {/* Middle Content */}
        <div className="my-12 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00C48C]/20 border border-[#00C48C]/30 text-[#00E5A3] text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-[#00C48C]" />
            <span>Zero-Knowledge Encrypted Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Share confidential notes with <span className="text-[#00C48C]">complete peace of mind.</span>
          </h1>

          <p className="text-base text-emerald-100/70 leading-relaxed mb-8">
            Protect sensitive credentials, API keys, and internal drafts with password protection, self-destructing links, and atomic view tracking.
          </p>

          <div className="space-y-4 text-sm font-medium text-emerald-100/90">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00C48C] shrink-0" />
              <span>Password-protected share links with bcrypt hashing</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00C48C] shrink-0" />
              <span>One-time burn-after-reading automatic link expiration</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00C48C] shrink-0" />
              <span>Real-time access analytics and instant link revocation</span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial Box */}
        <div className="z-10 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <p className="text-xs sm:text-sm text-emerald-100/80 italic leading-relaxed mb-3">
            "SecureNote is the safest and cleanest platform our engineering team uses for sharing staging environment credentials and API tokens."
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <div className="w-6 h-6 rounded-full bg-[#00C48C] text-white flex items-center justify-center font-bold text-[10px]">
              AK
            </div>
            <span>Alex K., Tech Lead</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Input Form Box */}
      <div className="w-full md:w-1/2 lg:w-5/12 bg-white dark:bg-[#151D2A] p-8 sm:p-12 lg:p-16 flex flex-col justify-center transition-colors duration-200">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Enter your account credentials to access your notes dashboard
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#00C48C] focus:ring-2 focus:ring-[#00C48C]/20 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#00C48C] focus:ring-2 focus:ring-[#00C48C]/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#00C48C] hover:bg-[#00A876] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-[#00C48C] hover:underline"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
