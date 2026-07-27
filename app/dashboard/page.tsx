"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  FileText,
  Plus,
  Lock,
  Eye,
  Trash2,
  Edit,
  Copy,
  Check,
  Clock,
  Zap,
  AlertTriangle,
  ShieldCheck,
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

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setNotes(json.data || json.notes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyShareUrl = (token: string) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getShareBadge = (share: NoteShare | null) => {
    if (!share) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-[#737373]">
          Not Shared
        </span>
      );
    }
    if (share.isRevoked) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
          <AlertTriangle className="w-3 h-3" />
          Revoked
        </span>
      );
    }
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
          <Clock className="w-3 h-3" />
          Expired
        </span>
      );
    }
    if (share.isOneTime && share.isUsed) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200">
          <Zap className="w-3 h-3" />
          Consumed
        </span>
      );
    }
    if (share.isPasswordProtected) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF0E6] text-[#FA661A] border border-[#FFD5C0]">
          <Lock className="w-3 h-3" />
          Password Protected
        </span>
      );
    }
    if (share.isOneTime) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200">
          <Zap className="w-3 h-3" />
          One-Time Link
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
        <ShieldCheck className="w-3 h-3" />
        Public Share
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#18181B] tracking-tight">
              My Secure Notes
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Manage your confidential notes and active share links
            </p>
          </div>
          <Link
            href="/notes/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#FA661A] hover:bg-[#E0530C] rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Note</span>
          </Link>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#E4E4E7] rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between"
              >
                <div className="h-4 bg-[#F4F4F5] rounded w-3/4" />
                <div className="h-3 bg-[#F4F4F5] rounded w-full" />
                <div className="h-3 bg-[#F4F4F5] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#FA661A] flex items-center justify-center mx-auto mb-4 border border-[#FFD5C0]">
              <FileText className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-[#18181B]">No notes yet</h3>
            <p className="text-sm text-[#6B7280] mt-1 mb-6">
              Create your first secure note and share it with custom expiry & password protection.
            </p>
            <Link
              href="/notes/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FA661A] hover:bg-[#E0530C] text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-lg font-bold text-[#18181B] truncate group-hover:text-[#FA661A] transition-colors">
                      {note.title}
                    </h2>
                    {getShareBadge(note.share)}
                  </div>

                  <p className="text-sm text-[#6B7280] line-clamp-3 leading-relaxed mb-6">
                    {note.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4F4F5] flex items-center justify-between text-xs text-[#737373]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title="Successful Views">
                      <Eye className="w-3.5 h-3.5 text-[#FA661A]" />
                      <span className="font-semibold text-[#18181B]">
                        {note.share?.viewCount || 0}
                      </span>
                    </span>
                    <span>
                      {new Date(note.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {note.share?.token && !note.share.isRevoked && (
                      <button
                        onClick={() => copyShareUrl(note.share!.token)}
                        title="Copy Share Link"
                        className="p-1.5 rounded-lg text-[#737373] hover:text-[#FA661A] hover:bg-[#FFF0E6] transition-colors"
                      >
                        {copiedToken === note.share.token ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    <Link
                      href={`/notes/${note.id}`}
                      title="Edit & Manage Share"
                      className="p-1.5 rounded-lg text-[#737373] hover:text-[#18181B] hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(note.id)}
                      title="Delete Note"
                      className="p-1.5 rounded-lg text-[#737373] hover:text-[#EF4444] hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
