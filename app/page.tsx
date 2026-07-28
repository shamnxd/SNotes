"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Lock, ArrowRight, Eye, ShieldCheck, Zap, Clock, Key } from "lucide-react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
          * { font-family: "Geist", sans-serif; }
        `}
      </style>

      <div className="flex flex-col items-center bg-gradient-to-b from-[#2F8CFF] to-slate-50 px-4 pt-6 min-h-screen text-slate-800 selection:bg-blue-200">
        {/* Floating Rounded Pill Navigation */}
        <nav className="flex items-center justify-between bg-[#4E9EFF] border border-white/40 rounded-full pl-4 md:pl-6 pr-3 md:pr-2 py-1.5 w-full max-w-3xl shadow-lg shadow-blue-500/20 sticky top-4 z-50">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" fill="#FFFFFF" />
            <span className="text-white font-extrabold text-xl tracking-tight">SNotes</span>
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
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-gray-50 hover:text-white text-sm font-medium transition"
            >
              Pricing
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
              className="hidden md:inline-block bg-white hover:bg-white/90 text-zinc-700 font-semibold px-6 py-2.5 rounded-full text-sm transition cursor-pointer shadow-sm"
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
        <h1 className="text-4xl sm:text-5xl md:text-[62px]/18 text-white text-center max-w-[750px] mt-16 md:mt-24 leading-tight font-extrabold tracking-tighter">
          Design notes & share safely in seconds
        </h1>

        <p className="text-sm md:text-base/6.5 text-white/95 text-center max-w-[500px] mt-4 font-normal leading-relaxed">
          A modern platform to create encrypted notes, protect secret links, set one-time burn timers, and track access safely for modern teams.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link
            href="/register"
            className="border border-white hover:bg-white/20 text-white text-sm font-semibold px-6 py-3 rounded-full tracking-tight transition cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span>Get started for free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="bg-white hover:bg-white/90 text-sm font-semibold text-zinc-700 px-6 py-3 rounded-full tracking-tight transition cursor-pointer shadow-sm"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Embedded Interactive Mockup Container */}
        <div className="mt-12 w-full max-w-[926px] mx-auto border-4 md:border-8 border-blue-300/80 rounded-2xl md:rounded-t-2xl md:rounded-b-none md:border-b-0 overflow-hidden shadow-2xl bg-white text-left p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xs font-semibold text-[#2F8CFF] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              SNotes Azure Blue Dashboard
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2F8CFF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  One-Time
                </span>
                <span className="text-xs text-slate-400">12 Views</span>
              </div>
              <div className="font-bold text-sm text-slate-900">Q4 Product Strategy.md</div>
              <div className="text-xs text-slate-500 line-clamp-2">
                Internal draft for quarterly roadmap and encrypted tokens.
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Password Protected
                </span>
                <span className="text-xs text-slate-400">45 Views</span>
              </div>
              <div className="font-bold text-sm text-slate-900">Project Phoenix - Arch</div>
              <div className="text-xs text-slate-500 line-clamp-2">
                Architecture diagrams for cloud migration project.
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
                  Time-Based
                </span>
                <span className="text-xs text-slate-400">234 Views</span>
              </div>
              <div className="font-bold text-sm text-slate-900">Team Sync Notes</div>
              <div className="text-xs text-slate-500 line-clamp-2">
                Discussion regarding new security protocols and token distribution.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
          &copy; {new Date().getFullYear()} SNotes. Powered by Electric Azure Theme.
        </footer>
      </div>
    </>
  );
}
