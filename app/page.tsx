import React from "react";
import { ArrowRight, Lock, ShieldCheck, Eye, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#FFF0E6] selection:text-[#FA661A]">
      {/* Top Brown Accent Strip */}
      <div className="h-1.5 w-full bg-[#3B2314]" />

      {/* Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FA661A] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <Lock className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#18181B]">
            SNotes
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#737373]">
          <a
            href="#features"
            className="hover:text-[#18181B] transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#18181B] transition-colors"
          >
            How It Works
          </a>
          <a href="#security" className="hover:text-[#18181B] transition-colors">
            Security
          </a>
        </nav>

        <div className="flex items-center gap-4 text-sm font-medium">
          <a
            href="/login"
            className="text-[#737373] hover:text-[#18181B] px-3 py-2 transition-colors"
          >
            Log in
          </a>
          <a
            href="/register"
            className="px-4 py-2 text-white bg-[#FA661A] hover:bg-[#E0530C] rounded-xl font-semibold transition-all shadow-sm active:scale-95"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-start text-center px-6 pt-16 pb-20 max-w-5xl mx-auto">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0E6] border border-[#FFD5C0] text-[#FA661A] text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#FA661A]" />
          <span>SNotes 2.0 is now live</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#18181B] tracking-tight leading-[1.15] max-w-4xl mb-6">
          The modern workspace for{" "}
          <span className="text-[#FA661A]">agile teams</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl leading-relaxed mb-10 font-normal">
          Unify your company's notes, password-protect confidential links, and
          track view analytics without the bloated interfaces of legacy software.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <a
            href="/register"
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-[#FA661A] hover:bg-[#E0530C] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-0"
          >
            <span>Start for free</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </a>
          <a
            href="/login"
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-[#18181B] bg-white border border-[#E4E4E7] hover:bg-[#F4F4F5] rounded-xl transition-all shadow-sm text-center"
          >
            Access Dashboard
          </a>
        </div>

        {/* Interactive App Window Preview */}
        <div className="w-full max-w-4xl bg-white border border-[#E4E4E7] rounded-2xl shadow-xl overflow-hidden text-left p-6 sm:p-8">
          {/* Traffic light dots */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#F4F4F5]">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          </div>

          {/* Wireframe Mockup Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#FAFAFC] border border-[#E4E4E7] p-4 rounded-xl">
              <div className="h-3 w-16 bg-[#FFF0E6] rounded-md mb-3" />
              <div className="h-4 w-24 bg-[#E4E4E7] rounded-md mb-2" />
              <div className="h-3 w-32 bg-[#F4F4F5] rounded-md" />
            </div>
            <div className="bg-[#FAFAFC] border border-[#E4E4E7] p-4 rounded-xl">
              <div className="h-3 w-16 bg-[#FFF0E6] rounded-md mb-3" />
              <div className="h-4 w-24 bg-[#E4E4E7] rounded-md mb-2" />
              <div className="h-3 w-32 bg-[#F4F4F5] rounded-md" />
            </div>
            <div className="bg-[#FAFAFC] border border-[#E4E4E7] p-4 rounded-xl">
              <div className="h-3 w-16 bg-[#FFF0E6] rounded-md mb-3" />
              <div className="h-4 w-24 bg-[#E4E4E7] rounded-md mb-2" />
              <div className="h-3 w-32 bg-[#F4F4F5] rounded-md" />
            </div>
          </div>

          <div className="bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl p-6 h-36 flex flex-col justify-between">
            <div className="h-3 w-3/4 bg-[#E4E4E7] rounded-md" />
            <div className="h-3 w-1/2 bg-[#F4F4F5] rounded-md" />
            <div className="h-2 w-1/4 bg-[#FFF0E6] rounded-md" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E4E4E7] bg-white py-6 text-center text-xs text-[#737373]">
        &copy; {new Date().getFullYear()} SNotes. Built with precision for agile teams.
      </footer>
    </div>
  );
}
