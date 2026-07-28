"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2F8CFF] flex items-center justify-center mb-6 border border-blue-100">
          <FileQuestion className="w-8 h-8 stroke-[1.5]" />
        </div>

        <span className="text-xs font-semibold text-[#2F8CFF] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider mb-4">
          404 Error
        </span>

        <h1 className="text-3xl md:text-5xl font-medium text-zinc-800 tracking-tight mb-4 max-w-xl">
          Page or Secret Note Not Found
        </h1>

        <p className="text-sm text-zinc-600 tracking-tight max-w-md leading-relaxed mb-8">
          The link you opened may have self-destructed after reading, reached its expiration time, or been revoked by the owner.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-[#2F8CFF] hover:bg-[#1E7BE6] text-white text-xs font-medium rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-zinc-800 text-xs font-medium rounded-full transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View My Notes</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
