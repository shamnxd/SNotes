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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Header Navigation */}
      <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00C48C] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-[#00C48C] leading-none">
                SecureNote
              </div>
              <div className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
                Digital Serenity
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#security" className="hover:text-slate-900 transition-colors">
              Security Architecture
            </a>
          </nav>

          <div className="flex items-center gap-3 text-sm font-medium">
            <Link
              href="/login"
              className="text-slate-600 hover:text-slate-900 px-3.5 py-2 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-white bg-[#00C48C] hover:bg-[#00A876] rounded-xl font-semibold transition-all shadow-sm active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-start text-center px-6 pt-16 pb-20 max-w-5xl mx-auto">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F8F2] border border-[#A7F3D0] text-[#059669] text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#00C48C]" />
          <span>SecureNote 2.0 is now live</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mb-6">
          Encrypted note sharing with{" "}
          <span className="text-[#00C48C]">Digital Serenity</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-10 font-normal">
          Create encrypted notes, protect custom share links with passwords, set one-time burn-after-reading timers, and track view counts securely.
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
            className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-slate-800 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all shadow-sm text-center"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Interactive App Preview */}
        <div className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden text-left p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            </div>
            <div className="text-xs font-semibold text-[#00C48C] bg-[#E6F8F2] px-3 py-1 rounded-full">
              SecureNote (White) Preview
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#059669] bg-[#E6F8F2] px-2 py-0.5 rounded-full">
                  One-Time
                </span>
                <span className="text-xs text-slate-400">12 Views</span>
              </div>
              <div className="font-bold text-sm text-slate-900">Q4 Product Strategy.md</div>
              <div className="text-xs text-slate-500 line-clamp-2">
                Internal draft for quarterly roadmap and encrypted credentials.
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                  Time-Based
                </span>
                <span className="text-xs text-slate-400">234 Views</span>
              </div>
              <div className="font-bold text-sm text-slate-900">Team Sync Meeting Notes</div>
              <div className="text-xs text-slate-500 line-clamp-2">
                Discussion regarding new security protocols and token distribution.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SecureNote. Digital Serenity Note Sharing.
      </footer>
    </div>
  );
}
