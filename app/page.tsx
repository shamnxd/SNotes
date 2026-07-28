"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Eye,
  ChevronDown,
  Key,
  Database,
  Server,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  FileText,
  Search,
  Bell,
  SlidersHorizontal,
} from "lucide-react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does one-time ('burn after reading') note sharing work?",
      answer:
        "When you generate a one-time link, SNotes uses atomic database operations in MongoDB. The very first successful attempt to view the note automatically marks it as consumed (`isUsed: true`) and increments the view counter in a single atomic transaction. Any subsequent access attempt will immediately fail with HTTP 410 GONE.",
    },
    {
      question: "Can I password-protect shared notes?",
      answer:
        "Yes! You can configure an access password when creating a share link. The password is hashed using bcrypt with salt rounds on the server before being saved. Visitors must enter the correct password to unlock and read the note content.",
    },
    {
      question: "How are time-based expiration dates enforced?",
      answer:
        "Every share link can be assigned an optional `expiresAt` timestamp. Whenever a recipient opens the link, SNotes compares the request timestamp against `expiresAt`. If the current time exceeds the expiration date, access is denied.",
    },
    {
      question: "Is my user authentication secure?",
      answer:
        "SNotes uses JSON Web Tokens (JWT) stored strictly inside `HttpOnly` and `SameSite=Lax` cookies, shielding authentication tokens from client-side XSS scripts.",
    },
    {
      question: "Can I revoke a share link after sending it?",
      answer:
        "Absolutely. You can revoke any active share link from your dashboard with one click. Once revoked, access is permanently blocked.",
    },
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
          * { font-family: "Geist", sans-serif; }
        `}
      </style>

      <div className="flex flex-col items-center bg-gradient-to-b from-[#2F8CFF] via-[#4E9EFF] to-slate-50 min-h-screen text-slate-800 selection:bg-blue-200">
        {/* Top Floating Pill Navigation */}
        <nav className="flex items-center justify-between bg-[#4E9EFF] border border-white/40 rounded-full pl-4 md:pl-6 pr-3 md:pr-2 py-1.5 w-full max-w-3xl shadow-lg shadow-blue-500/20 sticky top-4 z-50 mt-6 mx-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-7 h-7" fill="#FFFFFF" />
            <span className="text-white font-semibold text-lg tracking-tight">SNotes</span>
          </Link>

          {/* Mobile Overlay Menu */}
          <div
            className={`max-md:fixed max-md:bg-black/60 max-md:h-screen max-md:overflow-hidden max-md:transition-[width] max-md:duration-300 max-md:top-0 max-md:left-0 max-md:flex-col max-md:justify-center max-md:backdrop-blur-md flex items-center gap-8 z-50 md:gap-6 md:absolute md:left-1/2 md:-translate-x-1/2 ${
              mobileOpen ? "max-md:w-full" : "max-md:w-0"
            }`}
          >
            <a
              href="#"
              onClick={() => setMobileOpen(false)}
              className="text-gray-50 hover:text-white text-sm font-medium transition"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="text-gray-50 hover:text-white text-sm font-medium transition"
            >
              Features
            </a>
            <a
              href="#security"
              onClick={() => setMobileOpen(false)}
              className="text-gray-50 hover:text-white text-sm font-medium transition"
            >
              Security
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="text-gray-50 hover:text-white text-sm font-medium transition"
            >
              FAQ
            </a>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden bg-zinc-950 text-white p-2 rounded-md aspect-square font-medium transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/register"
              className="hidden md:inline-block bg-white hover:bg-white/90 text-zinc-600 px-6 py-3 rounded-full text-sm font-medium transition cursor-pointer shadow-xs"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden bg-white text-zinc-800 p-1.5 rounded-md aspect-square font-medium transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h16" />
                <path d="M4 18h16" />
                <path d="M4 6h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center px-4 w-full">
          <h1 className="text-5xl md:text-[62px]/18 text-white text-center max-w-[700px] mt-24 md:mt-30 bg-clip-text leading-tight font-medium tracking-tighter">
            Design notes & share safely in seconds
          </h1>

          <p className="text-sm md:text-base/6.5 text-white text-center max-w-[480px] mt-2 font-normal">
            A modern AI platform to generate content, automate workflows and accelerate decision-making for modern teams.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              href="/register"
              className="border border-white hover:bg-sky-200/30 text-white text-sm px-6 py-3 rounded-full tracking-tight transition cursor-pointer font-medium"
            >
              Get started for free
            </Link>
            <Link
              href="/login"
              className="bg-white hover:bg-white/90 text-sm text-zinc-600 px-5 py-3 rounded-full tracking-tight transition cursor-pointer font-medium shadow-sm"
            >
              Explore templates
            </Link>
          </div>

          {/* Hero App Mockup Preview Container */}
          <div className="mt-12.5 w-full max-w-[926px] mx-auto border-4 md:border-8 border-blue-300 rounded-2xl md:rounded-t-2xl md:rounded-b-none md:border-b-0 overflow-hidden shadow-2xl bg-white text-left">
            {/* Top Mockup App Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <Logo className="w-7 h-7" fill="#2F8CFF" />
                <span className="font-extrabold text-slate-800 text-lg tracking-tight">SNotes</span>
              </div>

              <div className="flex-1 max-w-xs mx-6 relative hidden sm:block">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  readOnly
                  placeholder="Search for something..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-100/70 rounded-full text-xs text-slate-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2F8CFF] font-bold flex items-center justify-center text-xs">
                    AH
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-semibold text-slate-800 text-xs">Andrew Harris</div>
                    <div className="text-[10px] text-slate-400">Admin</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inner Dashboard Body Mockup */}
            <div className="p-6 bg-slate-50/50 space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Notes</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">$4,450</div>
                  <div className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">+ 28% ↑</div>
                </div>

                <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Shares</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">$42,450</div>
                  <div className="text-[11px] font-medium text-rose-500 mt-1 flex items-center gap-1">+ 22% ↓</div>
                </div>

                <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Views</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">450</div>
                  <div className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">+ 22% ↑</div>
                </div>

                <div className="bg-white border border-slate-200/70 p-4 rounded-xl shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Registered Users</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">1,52,541</div>
                </div>
              </div>

              {/* Sample Notes Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200/80 p-4 rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#2F8CFF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      One-Time Link
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">12 Views</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">Q4 Product Strategy.md</div>
                  <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    Internal draft for quarterly roadmap and encrypted credentials.
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 p-4 rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      Password Protected
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">45 Views</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">Project Phoenix Architecture</div>
                  <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    Architecture diagrams for cloud migration project.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="w-full bg-white py-24 px-6 border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-semibold text-[#2F8CFF] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                Powerful Features
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Everything you need to share secret notes securely
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Fine-grained privacy controls designed to ensure your sensitive data is accessed only by authorized recipients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F8CFF] flex items-center justify-center border border-blue-100">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">One-Time Access ("Burn Link")</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Links self-destruct immediately after the first successful access attempt using atomic database transactions.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F8CFF] flex items-center justify-center border border-blue-100">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Password-Protected Sharing</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Set custom access passwords hashed with bcrypt on the server before note content can be unlocked.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F8CFF] flex items-center justify-center border border-blue-100">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Time-Based Expiration</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Specify exact expiration timestamps. Once expired, links immediately reject access with HTTP 410 GONE.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="w-full bg-slate-50 py-24 px-6 border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-semibold text-[#2F8CFF] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                Security Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Built with zero-trust security standards
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Enterprise-grade security measures engineered from the ground up to prevent unauthorized data exposure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 space-y-4 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2F8CFF] flex items-center justify-center border border-blue-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">HttpOnly JWT Cookie Transport</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Authentication tokens are transmitted exclusively inside `HttpOnly` and `SameSite=Lax` cookies, preventing client-side JavaScript from reading or exfiltrating session credentials.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 space-y-4 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2F8CFF] flex items-center justify-center border border-blue-100">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">MongoDB Atomic Concurrency Protection</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Single-use link verification utilizes MongoDB's atomic `findOneAndUpdate` queries. Concurrent requests are locked at the engine level to prevent race-condition bypasses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section (Replaces Pricing) */}
        <section id="faq" className="w-full bg-white py-24 px-6 border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <span className="text-xs font-semibold text-[#2F8CFF] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                Everything you need to know about note creation, link expiration, and security rules.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 text-base"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        openFaq === idx ? "rotate-180 text-[#2F8CFF]" : ""
                      }`}
                    />
                  </button>

                  {openFaq === idx && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo className="w-5 h-5" fill="#2F8CFF" />
              <span className="font-extrabold text-slate-900">SNotes</span>
            </div>
            <div>&copy; {new Date().getFullYear()} SNotes. Powered by Electric Azure Theme.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
