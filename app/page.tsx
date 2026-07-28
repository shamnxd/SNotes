import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  ShieldCheck,
  Eye,
  Sparkles,
  Zap,
  Clock,
  Key,
  Share2,
} from "lucide-react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-start text-center px-6 pt-16 pb-20 max-w-5xl mx-auto">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F8F2] dark:bg-[#00C48C]/15 border border-[#A7F3D0] dark:border-[#00C48C]/30 text-[#059669] dark:text-[#00E5A3] text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#00C48C]" />
          <span>SecureNote 2.0 with Light & Dark Theme</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mb-6">
          Encrypted note sharing with{" "}
          <span className="text-[#00C48C]">Digital Serenity</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-10 font-normal">
          Create encrypted notes, protect custom share links with passwords, set one-time burn-after-reading timers, and switch between Light & Dark themes seamlessly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-[#00C48C] hover:bg-[#00A876] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-0"
          >
            <span>Start for free</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#151D2A] border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm text-center"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Interactive App Preview */}
        <div className="w-full max-w-4xl bg-white dark:bg-[#151D2A] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden text-left p-6 sm:p-8 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            </div>
            <div className="text-xs font-semibold text-[#00C48C] bg-[#E6F8F2] dark:bg-[#00C48C]/20 px-3 py-1 rounded-full">
              SecureNote Preview
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#059669] dark:text-[#00E5A3] bg-[#E6F8F2] dark:bg-[#00C48C]/20 px-2 py-0.5 rounded-full">
                  One-Time
                </span>
                <span className="text-xs text-slate-400">12 Views</span>
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Q4 Product Strategy.md</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                Internal draft for quarterly roadmap and encrypted credentials.
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  Time-Based
                </span>
                <span className="text-xs text-slate-400">234 Views</span>
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Team Sync Meeting Notes</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                Discussion regarding new security protocols and token distribution.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} SecureNote. Digital Serenity Note Sharing.
      </footer>
    </div>
  );
}
