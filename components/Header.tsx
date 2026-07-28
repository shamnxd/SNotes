"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Lock,
  LogOut,
  Plus,
  FileText,
  Search,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HeaderUser {
  id: string;
  name: string;
  email: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
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
    <header className="w-full bg-white dark:bg-[#151D2A] border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#00C48C] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#00A876] transition-colors">
            <Lock className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-[#00C48C] leading-none">
              SecureNote
            </div>
            <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
              Digital Serenity
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
              className="w-full pl-10 pr-4 py-2 bg-slate-100/70 dark:bg-slate-800/70 focus:bg-white dark:focus:bg-slate-800 border border-transparent focus:border-[#00C48C] rounded-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
            />
          </div>
        )}

        {/* Navigation & Profile Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {user ? (
            <>
              {/* Notification Bell */}
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="w-2 h-2 bg-[#00C48C] rounded-full absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {/* Create Note Button */}
              <Link
                href="/notes/new"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#00C48C] hover:bg-[#00A876] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Create Note</span>
              </Link>

              <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E6F8F2] dark:bg-[#00C48C]/20 text-[#059669] dark:text-[#00E5A3] font-bold text-xs flex items-center justify-center ring-2 ring-[#00C48C]/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#00C48C] hover:bg-[#00A876] rounded-xl shadow-sm transition-all"
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
