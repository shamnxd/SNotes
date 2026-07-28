"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import {
  LayoutGrid,
  Plus,
  FileText,
  Share2,
  User as UserIcon,
  Settings,
  LogOut,
  Search,
  Bell,
  MoreVertical,
  Copy,
  Check,
  Eye,
  Lock,
  Clock,
  Zap,
  AlertCircle,
  SlidersHorizontal,
  Grid,
  List,
  ShieldCheck,
  Key,
  Flame,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
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

  // Default demo notes if user hasn't created any yet
  const displayNotes: Note[] = notes.length > 0 ? notes : [
    {
      id: "demo-1",
      title: "Q4 Product Strategy.md",
      content: "Internal draft for the quarterly roadmap. Includes private API keys, design specifications, and launch schedules.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      share: {
        id: "s-1",
        token: "demo-token-1",
        isPasswordProtected: true,
        isOneTime: true,
        isUsed: false,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        isRevoked: false,
        viewCount: 12,
      },
    },
    {
      id: "demo-2",
      title: "Project Phoenix - Architecture",
      content: "Final architecture diagrams for the cloud migration project. Please review infrastructure topologies before staging.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      share: {
        id: "s-2",
        token: "demo-token-2",
        isPasswordProtected: false,
        isOneTime: false,
        isUsed: false,
        expiresAt: new Date(Date.now() - 7200000).toISOString(), // Expired 2h ago
        isRevoked: false,
        viewCount: 45,
      },
    },
    {
      id: "demo-3",
      title: "Login Credentials - Sandbox",
      content: "Temporary access tokens for the staging environment. These will expire upon database reset.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      share: {
        id: "s-3",
        token: "demo-token-3",
        isPasswordProtected: true,
        isOneTime: true,
        isUsed: true,
        isRevoked: true,
        viewCount: 0,
      },
    },
    {
      id: "demo-4",
      title: "Team Sync Meeting Notes",
      content: "Discussion regarding the new security protocols and encrypted token distribution for distributed teams.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      share: {
        id: "s-4",
        token: "demo-token-4",
        isPasswordProtected: false,
        isOneTime: false,
        isUsed: false,
        expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(), // 5 days
        isRevoked: false,
        viewCount: 234,
      },
    },
  ];

  const filteredNotes = displayNotes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute Statistics
  const totalNotes = notes.length > 0 ? notes.length : 128;
  const activeShares = displayNotes.filter((n) => n.share && !n.share.isRevoked && (!n.share.expiresAt || new Date(n.share.expiresAt) > new Date())).length || 42;
  const expiredShares = displayNotes.filter((n) => n.share?.expiresAt && new Date(n.share.expiresAt) < new Date()).length || 89;
  const revokedShares = displayNotes.filter((n) => n.share?.isRevoked).length || 12;
  const totalViews = displayNotes.reduce((acc, curr) => acc + (curr.share?.viewCount || 0), 0) || 1200;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Top Navbar Header */}
      <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
            <Logo className="w-9 h-9" fill="#00C48C" />
            <div>
              <div className="text-xl font-extrabold tracking-tight text-[#00C48C] leading-none">
                SecureNote
              </div>
              <div className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
                Digital Serenity
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-6 relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search secure notes..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/70 focus:bg-white border border-transparent focus:border-[#00C48C] rounded-full text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 bg-[#00C48C] rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            <Link
              href="/notes/new"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#00C48C] hover:bg-[#00A876] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Note</span>
            </Link>

            <div className="w-9 h-9 rounded-full bg-[#E6F8F2] text-[#059669] font-bold text-sm flex items-center justify-center ring-2 ring-[#00C48C]/20 shrink-0">
              SN
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col md:flex-row p-6 gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-60 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shrink-0 shadow-sm">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[#E6F8F2] text-[#059669]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <Link
              href="/notes/new"
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </Link>

            <button
              onClick={() => setActiveTab("dashboard")}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>My Notes</span>
            </button>

            <button
              onClick={() => setActiveTab("shares")}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Shared Links</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Center Main Content: Recent Shares Grid */}
        <main className="flex-1 space-y-6 min-w-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Recent Shares
            </h1>

            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-1 shadow-sm">
                <button className="p-1.5 bg-[#E6F8F2] text-[#059669] rounded-lg">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-700">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2x2 Grid of Note Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredNotes.map((note) => {
              const share = note.share;
              const isExpired = share?.expiresAt && new Date(share.expiresAt) < new Date();
              const isRevoked = share?.isRevoked;
              const isActive = share && !isRevoked && !isExpired && (!share.isOneTime || !share.isUsed);

              return (
                <div
                  key={note.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top Badges & Options */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {share?.isOneTime && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#059669] border border-emerald-100">
                            One-Time
                          </span>
                        )}
                        {share?.expiresAt && !share.isOneTime && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Time-Based
                          </span>
                        )}
                        {share?.isPasswordProtected ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Password Protected
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Public
                          </span>
                        )}
                      </div>

                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Note Title & Content Excerpt */}
                    <h2 className="text-base font-bold text-slate-900 mb-1.5 truncate">
                      {note.title}
                    </h2>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="space-y-0.5">
                      <div>
                        {isRevoked
                          ? "Revoked by user"
                          : isExpired
                          ? "Expired 2h ago"
                          : "Expires tomorrow"}
                      </div>
                      <div className="flex items-center gap-1 font-medium text-slate-500">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{share?.viewCount || 0} Views</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Dot */}
                      <span className="flex items-center gap-1.5 text-xs font-semibold">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isRevoked
                              ? "bg-slate-400"
                              : isExpired
                              ? "bg-rose-500"
                              : "bg-[#10B981]"
                          }`}
                        />
                        <span
                          className={
                            isRevoked
                              ? "text-slate-500"
                              : isExpired
                              ? "text-rose-600"
                              : "text-[#059669]"
                          }
                        >
                          {isRevoked ? "Revoked" : isExpired ? "Expired" : "Active"}
                        </span>
                      </span>

                      {/* Action Button */}
                      {isActive && share?.token ? (
                        <button
                          onClick={() => copyShareUrl(share.token)}
                          className="px-3 py-1.5 bg-[#E6F8F2] hover:bg-[#d4f3e7] text-[#059669] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          {copiedToken === share.token ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#059669]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      ) : isExpired ? (
                        <button disabled className="px-3 py-1.5 bg-slate-100 text-slate-400 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-not-allowed">
                          <span>Link Dead</span>
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
                          <span>Reshare</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Right Sidebar Panels */}
        <aside className="w-full md:w-80 space-y-6 shrink-0">
          {/* Quick Stats Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Quick Stats
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="text-[11px] font-medium text-slate-400">Total Notes</div>
                <div className="text-2xl font-bold text-[#059669] mt-0.5">{totalNotes}</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="text-[11px] font-medium text-slate-400">Active Shares</div>
                <div className="text-2xl font-bold text-[#059669] mt-0.5">{activeShares}</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="text-[11px] font-medium text-slate-400">Expired</div>
                <div className="text-2xl font-bold text-amber-600 mt-0.5">{expiredShares}</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="text-[11px] font-medium text-slate-400">Revoked</div>
                <div className="text-2xl font-bold text-rose-600 mt-0.5">{revokedShares}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-600">Total Link Views</span>
                <span className="text-slate-900 text-sm font-bold">1.2k</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00C48C] w-3/4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Activity Timeline Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Activity
            </h3>

            <div className="space-y-4 text-xs">
              {/* Item 1 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#E6F8F2] text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    Someone viewed <span className="font-bold">"Q4 Product Strategy.md"</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    2 minutes ago • IP: 192.168.1.1
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    Shared <span className="font-bold">"Architecture Diagram"</span> with Team A
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    45 minutes ago
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    Password changed for <span className="font-bold">"Internal DB Config"</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    2 hours ago
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    <span className="font-bold">"Draft Pitch"</span> link expired
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    4 hours ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
