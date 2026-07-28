"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  Plus,
  Search,
  Copy,
  Check,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

interface NoteShare {
  id: string;
  token: string;
  isPasswordProtected: boolean;
  isOneTime: boolean;
  isUsed: boolean;
  expiresAt?: string;
  isRevoked: boolean;
  viewCount: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  share: NoteShare | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Search and Debounce State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 300ms Debounce effect for search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search term
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Notes from Backend with Search & Pagination query params
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/notes?search=${encodeURIComponent(
        debouncedSearch
      )}&page=${currentPage}&limit=9`;
      const res = await fetch(url);

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const json = await res.json();
      if (res.ok && json.success !== false) {
        setNotes(json.data || json.notes || []);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage, router]);

  useEffect(() => {
    fetch("/api/auth/me").then((res) => {
      if (res.status === 401) {
        router.push("/login?callbackUrl=/dashboard");
      }
    });
  }, [router]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const copyShareUrl = (token: string) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />

      {/* Main Content Area - Matched to Homepage Max Width (max-w-6xl mx-auto px-6) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col items-center">
        {/* Page Header Row */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-9">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium text-zinc-800 mb-2 tracking-tight">
              My Notes
            </h1>
            <p className="text-sm text-zinc-800 tracking-tight max-w-xl">
              Manage your secret notes, active share links, password protections, and expiration rules.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input with Debounce */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#2F8CFF] transition-all w-44 sm:w-56"
              />
            </div>

            <Link
              href="/notes/new"
              className="px-5 py-2.5 text-xs font-medium text-white bg-[#2F8CFF] hover:bg-[#1E7BE6] rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Note</span>
            </Link>
          </div>
        </div>

        {/* Loading Skeleton Grid (3x3) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-full w-full border-t border-l border-zinc-200 mb-9">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="relative p-6 md:p-8 flex flex-col justify-between gap-4 border-r border-b border-zinc-200 bg-white min-h-[220px] animate-pulse"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="w-16 h-4 bg-slate-100 rounded-full" />
                      <div className="w-14 h-3 bg-slate-100 rounded" />
                    </div>
                    <div className="w-3/4 h-5 bg-slate-100 rounded" />
                    <div className="w-full h-3 bg-slate-100 rounded" />
                    <div className="w-5/6 h-3 bg-slate-100 rounded" />
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="w-16 h-3 bg-slate-100 rounded" />
                    <div className="w-20 h-6 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
          </div>
        ) : notes.length > 0 ? (
          /* 3x3 Grid Layout with Sharp Borders (rounded-none) matching theme.md */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-full w-full border-t border-l border-zinc-200 mb-9">
            {notes.map((note) => {
              const share = note.share;
              const isExpired =
                share?.expiresAt && new Date(share.expiresAt) < new Date();
              const isRevoked = share?.isRevoked;
              const isActive =
                share &&
                !isRevoked &&
                !isExpired &&
                (!share.isOneTime || !share.isUsed);

              return (
                <div
                  key={note.id}
                  className="relative p-6 md:p-8 flex flex-col justify-between gap-4 border-r border-b border-zinc-200 bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#EBF3FF] transition-all duration-300 cursor-pointer min-h-[220px]"
                >
                  <div className="space-y-3">
                    {/* Status Pills */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {share?.isOneTime && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-[#2F8CFF] border border-blue-100">
                            One-Time
                          </span>
                        )}
                        {share?.expiresAt && !share.isOneTime && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Time-Based
                          </span>
                        )}
                        {share?.isPasswordProtected && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Password
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-zinc-400">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Note Title & Content Excerpt matching theme.md font sizes */}
                    <h3 className="text-sm font-medium text-zinc-800 leading-snug line-clamp-1">
                      {note.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                      {note.content}
                    </p>
                  </div>

                  {/* Card Bottom Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{share?.viewCount || 0} Views</span>
                    </div>

                    {/* Action Button */}
                    {isActive && share?.token ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyShareUrl(share.token);
                        }}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#2F8CFF] font-medium text-xs border border-blue-100 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedToken === share.token ? (
                          <>
                            <Check className="w-3 h-3 text-[#2F8CFF]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    ) : isExpired ? (
                      <span className="text-[11px] text-rose-600 font-medium">
                        ● Expired
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-400 font-medium">
                        ● Revoked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full border border-dashed border-slate-200 p-12 text-center my-8 space-y-3">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-medium text-zinc-800">
              {debouncedSearch ? "No matching notes found" : "No notes found"}
            </h3>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto">
              {debouncedSearch
                ? `No secret notes match "${debouncedSearch}". Try a different keyword.`
                : "You haven't created any secret notes yet. Click 'Create Note' to start sharing encrypted notes."}
            </p>
            {!debouncedSearch && (
              <Link
                href="/notes/new"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#2F8CFF] hover:bg-[#1E7BE6] rounded-full transition-all mt-2"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Create Note</span>
              </Link>
            )}
          </div>
        )}

        {/* 3x3 Grid Backend Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between w-full pt-4">
            <p className="text-xs text-zinc-600">
              Showing Page <span className="font-medium text-zinc-800">{currentPage}</span> of{" "}
              <span className="font-medium text-zinc-800">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-10 w-10 rounded-none bg-white border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-all text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-10 w-10 rounded-none bg-white border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-all text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
