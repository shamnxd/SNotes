"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { LogOut, Plus, Search, Bell } from "lucide-react";

interface HeaderUser {
  id: string;
  name: string;
  email: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<HeaderUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group shrink-0">
          <Logo className="w-9 h-9 transition-transform group-hover:scale-105" fill="#2F8CFF" />
          <div>
            <div className="text-xl font-extrabold tracking-tight text-[#2F8CFF] leading-none">
              SNotes
            </div>
            <div className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
              Secure Digital Workspace
            </div>
          </div>
        </Link>

        {/* Center Search Bar (for logged in users) */}
        {user && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search secure notes..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/70 focus:bg-white border border-transparent focus:border-[#2F8CFF] rounded-full text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>
        )}

        {/* Navigation & Profile Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="w-2 h-2 bg-[#2F8CFF] rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              {/* Create Note Button */}
              <Link
                href="/notes/new"
                className="px-5 py-2 text-sm font-semibold text-white bg-[#2F8CFF] hover:bg-[#1E7BE6] rounded-full shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Note</span>
              </Link>

              <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2F8CFF] font-bold text-xs flex items-center justify-center ring-2 ring-[#2F8CFF]/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-semibold text-white bg-[#2F8CFF] hover:bg-[#1E7BE6] rounded-full shadow-sm transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
