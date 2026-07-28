"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Search, LogOut } from "lucide-react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Features list formatted for SNotes with Electric Azure Blue (#2F8CFF) SVG Icons
  const features = [
    {
      icon: (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.25 15.75a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.598 3.066C10.665 6.104 6.75 7.08.938 7.454m14.625 1.429c-4.966-1.057-9.106.75-12.285 4.74" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.67 1.313c3.278 4.5 4.5 7.065 6 13.29" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Self-Destructing Links",
      description: "Notes automatically vanish forever after the first view. No leftover traces or cached copies.",
      hasAccent: false,
    },
    {
      icon: (
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.05.75H3.45a1.8 1.8 0 0 0-1.8 1.8v7.2a1.8 1.8 0 0 0 1.8 1.8h12.6a1.8 1.8 0 0 0 1.8-1.8v-7.2a1.8 1.8 0 0 0-1.8-1.8M.75 15.148h18" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Password Protection",
      description: "Lock secret notes behind a custom passcode so only your intended recipient can unlock them.",
      hasAccent: true,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#a)" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 14.665A6.667 6.667 0 1 0 8 1.332a6.667 6.667 0 0 0 0 13.333" />
            <path d="M8 1.332a9.667 9.667 0 0 0 0 13.333A9.667 9.667 0 0 0 8 1.332M1.333 8h13.334" />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
          </defs>
        </svg>
      ),
      title: "Expiration Timers",
      description: "Set custom countdown timers. Once time runs out, the note link permanently self-destructs.",
      hasAccent: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#a)" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.553 1.452a1.33 1.33 0 0 0-1.106 0l-5.714 2.6a.667.667 0 0 0 0 1.22l5.72 2.607a1.33 1.33 0 0 0 1.107 0l5.72-2.6a.667.667 0 0 0 0-1.22z" />
            <path d="M1.333 8a.67.67 0 0 0 .387.607l5.733 2.606a1.33 1.33 0 0 0 1.1 0l5.72-2.6A.67.67 0 0 0 14.667 8" />
            <path d="M1.333 11.332a.67.67 0 0 0 .387.607l5.733 2.606a1.33 1.33 0 0 0 1.1 0l5.72-2.6a.67.67 0 0 0 .394-.613" />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
          </defs>
        </svg>
      ),
      title: "One-Click Revocation",
      description: "Instantly cancel any active share link from your dashboard at any time to block access immediately.",
      hasAccent: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.333 1.332 14 3.999l-2.667 2.666" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 7.333v-.666A2.667 2.667 0 0 1 4.667 4H14M4.667 14.665 2 12l2.667-2.667" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 8.668v.667A2.667 2.667 0 0 1 11.333 12H2" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Real-Time View Tracking",
      description: "Track exact access counts and view timestamps for all your active note links in one place.",
      hasAccent: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.667 9.334a.667.667 0 0 1-.52-1.087l6.6-6.8a.333.333 0 0 1 .573.307L8.04 5.767a.667.667 0 0 0 .627.9h4.666a.666.666 0 0 1 .52 1.087l-6.6 6.8a.334.334 0 0 1-.573-.307l1.28-4.013a.667.667 0 0 0-.627-.9z" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Zero-Trust Privacy",
      description: "Your credentials and session tokens are encrypted safely in your browser without client-side risks.",
      hasAccent: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#a)">
            <path d="M9.8 4.201a.667.667 0 0 0 0 .933l1.067 1.067a.666.666 0 0 0 .933 0l2.07-2.07c.214-.215.576-.147.656.145A4 4 0 0 1 9.02 8.981l-5.273 5.274a1.414 1.414 0 0 1-2-2L7.021 6.98a4 4 0 0 1 4.704-5.506c.292.08.36.441.146.656z" stroke="#2F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
          </defs>
        </svg>
      ),
      title: "Fully Responsive",
      description: "Create, manage, and unlock secret notes seamlessly across mobile, tablet, and desktop devices.",
      hasAccent: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m10.667 12 4-4-4-4M5.333 4l-4 4 4 4" stroke="#2F8CFF" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Double-Access Lock",
      description: "Prevents two people from opening a one-time link at the exact same millisecond.",
      hasAccent: false,
    },
  ];

  // Testimonials state and logic
  const testimonials = [
    {
      id: 1,
      date: "Jun 10, 2026",
      text: "“SNotes made sharing sensitive API keys and database credentials with my team infinitely safer with one-time burn links.”",
      name: "James Bond",
      role: "Amazon.com, Inc.",
      img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    },
    {
      id: 2,
      date: "Jun 10, 2026",
      text: "“Setting password-protected note links with auto-expiration has saved our engineering team from accidental data leaks.”",
      name: "Emily Rodriguez",
      role: "The Walt Disney Company",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    },
    {
      id: 3,
      date: "Jun 10, 2026",
      text: "“SNotes is by far the cleanest and simplest secure note sharing tool we've used. Self-destructing links give us total peace of mind.”",
      name: "Jack",
      role: "Meta Platforms, Inc.",
      img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    },
    {
      id: 4,
      date: "Jul 12, 2026",
      text: "“An absolute must-have security tool for modern teams who share confidential data and temporary credentials.”",
      name: "Sarah Williams",
      role: "Spotify",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    },
    {
      id: 5,
      date: "Jul 12, 2026",
      text: "“The user interface is stunningly clean and intuitive. Revoking links with a single click is a lifesaver.”",
      name: "Michael Chen",
      role: "Google LLC",
      img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + 3 >= testimonials.length ? 0 : prev + 3
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev - 3 < 0 ? Math.max(testimonials.length - 3, 0) : prev - 3
    );
  };

  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 >= testimonials.length ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, testimonials.length]);

  const faqs = [
    {
      question: "How do self-destructing ('one-time') notes work?",
      answer:
        "As soon as your recipient opens the link and views the note, the link automatically expires and burns. Anyone trying to open it a second time will see an unavailable message.",
    },
    {
      question: "Can I add a password to my shared notes?",
      answer:
        "Yes! You can set an optional password when creating a link. Recipients must enter the exact password to read the contents.",
    },
    {
      question: "What happens when a note link expires?",
      answer:
        "Once the set expiration time passes, the link becomes permanently inactive and cannot be accessed by anyone.",
    },
    {
      question: "Is my account information safe?",
      answer:
        "Yes, we use encrypted security tokens stored safely in your browser to protect your session from unauthorized access.",
    },
    {
      question: "Can I cancel a link after sharing it?",
      answer:
        "Yes! You can revoke any active link directly from your dashboard at any time to block access immediately.",
    },
  ];

  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.success !== false && json.data) {
          setUser(json.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
          * { font-family: "Geist", sans-serif; }
        `}
      </style>

      {/* Hero Section Container */}
      <div className="flex flex-col items-center bg-gradient-to-b from-[#2F8CFF] to-white px-4 pt-6">
        {/* Floating Pill Navigation */}
        <nav className="flex items-center justify-between bg-[#4E9EFF] border border-white/40 rounded-full pl-4 md:pl-6 pr-3 md:pr-2 py-1.5 w-full max-w-3xl">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" fill="#FFFFFF" />
            <span className="text-white font-semibold text-lg tracking-tight">SNotes</span>
          </Link>

          <div
            id="menu"
            className={`max-md:absolute max-md:bg-black/50 max-md:h-[785px] max-md:overflow-hidden max-md:transition-[width] max-md:duration-300 max-md:top-0 max-md:left-0 max-md:flex-col max-md:justify-center max-md:backdrop-blur flex items-center gap-8 z-50 md:gap-6 md:absolute md:left-1/2 md:-translate-x-1/2 ${
              mobileOpen ? "max-md:w-full" : "max-md:w-0"
            }`}
          >
            <a href="#" onClick={() => setMobileOpen(false)} className="text-gray-50 hover:text-white text-sm">
              Home
            </a>
            <a href="#features" onClick={() => setMobileOpen(false)} className="text-gray-50 hover:text-white text-sm">
              Features
            </a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-gray-50 hover:text-white text-sm">
              Pricing
            </a>
            <a href="#faq" onClick={() => setMobileOpen(false)} className="text-gray-50 hover:text-white text-sm">
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
            {user ? (
              <Link
                href="/notes/new"
                className="hidden md:inline-block bg-white hover:bg-white/90 text-zinc-800 px-6 py-3 rounded-full text-sm font-medium transition cursor-pointer shadow-xs"
              >
                Create Note
              </Link>
            ) : (
              <Link
                href="/register"
                className="hidden md:inline-block bg-white hover:bg-white/90 text-zinc-600 px-6 py-3 rounded-full text-sm font-medium transition cursor-pointer"
              >
                Get Started
              </Link>
            )}
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

        {/* Hero Title - Exact 2 lines */}
        <h1 className="text-5xl md:text-[62px]/18 text-white text-center max-w-[700px] mt-24 md:mt-30 leading-tight font-medium tracking-tighter">
          Design notes & share <br className="hidden sm:block" /> safely in seconds
        </h1>

        {/* Hero Subtitle - Exactly 2 lines */}
        <p className="text-sm md:text-base/6.5 text-white text-center max-w-[600px] mt-2 font-normal">
          A modern platform to create encrypted notes, automate workflows <br className="hidden sm:block" /> and accelerate decision-making for modern teams.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/notes/new"
            className="border border-white hover:bg-sky-200/30 text-white text-sm px-6 py-3 rounded-full tracking-tight transition cursor-pointer font-medium"
          >
            Create a Secret Note
          </Link>
          <Link
            href="/dashboard"
            className="bg-white hover:bg-white/90 text-sm text-zinc-600 px-5 py-3 rounded-full tracking-tight transition cursor-pointer font-medium"
          >
            Open Dashboard
          </Link>
        </div>

        {/* High-End SNotes Dashboard UI Mockup Frame matching current My Notes page exact original height */}
        <div className="mt-12.5 w-full">
          <div className="w-full max-w-[926px] mx-auto border-4 md:border-8 border-blue-300 rounded-2xl md:rounded-t-2xl md:rounded-b-none md:border-b-0 bg-white text-left shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4">
            {/* Top Mockup Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 mr-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <Logo className="w-6.5 h-6.5" fill="#2F8CFF" />
                <span className="text-base font-semibold tracking-tight text-slate-900 leading-none">
                  SNotes
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 rounded-full flex items-center gap-1 cursor-pointer">
                  <LogOut className="w-3 h-3 text-slate-500" />
                  <span>Logout</span>
                </div>
              </div>
            </div>

            {/* Page Title & Controls Row matching My Notes page */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-medium text-zinc-800 tracking-tight">
                  My Notes
                </h2>
                <p className="text-xs text-zinc-600 tracking-tight max-w-md mt-0.5">
                  Manage your secret notes, active share links, password protections, and expiration rules.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Search notes..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 outline-none w-36 sm:w-44"
                  />
                </div>

                <div className="px-4 py-1.5 text-xs font-medium text-white bg-[#2F8CFF] rounded-full flex items-center gap-1">
                  <span>+ Create Note</span>
                </div>
              </div>
            </div>

            {/* 3-Column Grid matching My Notes page sharp border design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-full w-full border-t border-l border-zinc-200">
              {/* Card 1 */}
              <div className="p-4 flex flex-col justify-between gap-3 border-r border-b border-zinc-200 bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#EBF3FF] transition-all min-h-[140px]">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-[#2F8CFF] border border-blue-100">
                        One-Time
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Password
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">7/28/2026</span>
                  </div>
                  <h3 className="text-xs font-medium text-zinc-800 line-clamp-1">
                    Q4 Product Strategy.md
                  </h3>
                  <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-2">
                    Internal draft for quarterly roadmap and encrypted credentials.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-medium">12 Views</span>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#2F8CFF] font-medium text-[10px] border border-blue-100">
                    Copy Link
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 flex flex-col justify-between gap-3 border-r border-b border-zinc-200 bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#EBF3FF] transition-all min-h-[140px]">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      Time-Based
                    </span>
                    <span className="text-[10px] text-zinc-400">7/27/2026</span>
                  </div>
                  <h3 className="text-xs font-medium text-zinc-800 line-clamp-1">
                    Project Phoenix Architecture
                  </h3>
                  <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-2">
                    Final architecture diagrams for cloud migration project.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-medium">45 Views</span>
                  <span className="text-[10px] text-rose-600 font-medium">● Expired</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 flex flex-col justify-between gap-3 border-r border-b border-zinc-200 bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#EBF3FF] transition-all min-h-[140px]">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-[#2F8CFF] border border-blue-100">
                        One-Time
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">7/26/2026</span>
                  </div>
                  <h3 className="text-xs font-medium text-zinc-800 line-clamp-1">
                    Sandbox API Credentials
                  </h3>
                  <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-2">
                    Temporary access tokens for staging environment. Self-destruct enabled.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-medium">3 Views</span>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#2F8CFF] font-medium text-[10px] border border-blue-100">
                    Copy Link
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid Section - Exact User Design layout with SNotes Electric Azure Blue theme */}
      <section id="features" className="bg-white px-8 lg:px-20 xl:px-[120px] py-20 flex flex-col items-center border-t border-slate-200/80">
        <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl w-full mb-9">
          <h2 className="text-2xl md:text-3xl font-medium text-zinc-800 mb-4 tracking-tight">
            Designed for real privacy & security
          </h2>
          <p className="text-sm text-zinc-800 tracking-tight max-w-xl">
            We create thoughtfully crafted encryption controls that keep your secret data safe while enabling seamless sharing.
          </p>
        </div>

        {/* Features Grid with Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl w-full border-t border-l border-zinc-200">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative p-6 md:p-8 flex flex-col gap-4 border-r border-b border-zinc-200 transition-all duration-300 cursor-pointer ${
                index === 0
                  ? "bg-gradient-to-b from-white to-[#EBF3FF]"
                  : "bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#EBF3FF]"
              }`}
            >
              {feature.hasAccent && (
                <div className="absolute left-0 top-12 bottom-12 md:top-17 md:bottom-17 w-1.5 bg-[#2F8CFF] rounded-r" />
              )}

              <div className="flex items-center gap-2.5 mb-1">
                <div>{feature.icon}</div>
                <h3 className="text-sm font-medium text-zinc-800 leading-snug">
                  {feature.title}
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white px-8 lg:px-20 xl:px-[120px] py-20 flex flex-col items-center border-t border-slate-200/80">
        <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-9">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium text-zinc-800 mb-4 tracking-tight text-center md:text-left">
                Loved by 10k+ People
              </h2>
              <p className="text-sm text-zinc-800 tracking-tight max-w-xl text-center md:text-left mx-auto md:mx-0">
                Every single testimonial is a testament to the profound impact we strive to create every single day.
              </p>
            </div>

            <div className="hidden md:flex justify-end gap-2">
              <button
                onClick={handlePrev}
                className="h-10 w-10 rounded-none bg-white border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-all text-neutral-600"
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
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="h-10 w-10 rounded-none bg-white border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-all text-neutral-600"
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
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Testimonials Grid with Borders and No Roundness - Matching Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl w-full border-t border-l border-zinc-200">
            {testimonials
              .slice(currentIndex, isMobile ? currentIndex + 1 : currentIndex + 3)
              .map((item) => (
                <div
                  key={item.id}
                  className="relative p-6 md:p-8 flex flex-col justify-between gap-4 border-r border-b border-zinc-200 bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#EBF3FF] transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-transparent fill-[#FF8F20]"
                              aria-hidden="true"
                            >
                              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                            </svg>
                          ))}
                      </div>
                      <p className="text-xs text-zinc-400 font-normal">{item.date}</p>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed mb-4">{item.text}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={item.img}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-zinc-800 leading-snug">{item.name}</h3>
                      <p className="text-xs text-zinc-600">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="hidden max-[768px]:flex items-center justify-center mt-5 space-x-2">
          {testimonials.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                index === currentIndex ? "bg-neutral-800" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white px-8 lg:px-20 xl:px-[120px] py-20 flex flex-col items-center border-t border-slate-200/80">
        <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side Header */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl md:text-3xl font-medium text-zinc-800 mb-4 tracking-tight">
              Looking for answer?
            </h2>
            <p className="text-sm text-zinc-800 tracking-tight max-w-xl">
              Everything you need to know about note creation, link expiration, and security rules.
            </p>
          </div>

          {/* Right Side FAQ Accordion List */}
          <div className="lg:col-span-7 space-y-2 w-full">
            {faqs.map((faq, index) => (
              <div
                className="border-b border-slate-200 py-4 cursor-pointer w-full"
                key={index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-slate-900">
                    {faq.question}
                  </h3>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${
                      openIndex === index ? "rotate-180" : ""
                    } transition-all duration-500 ease-in-out`}
                  >
                    <path
                      d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                      stroke="#1D293D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p
                  className={`text-sm text-slate-500 transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                      : "opacity-0 max-h-0 -translate-y-2 overflow-hidden"
                  }`}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-gray-500/20 text-gray-500">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Logo className="w-8 h-8" fill="#2F8CFF" />
                <span className="font-extrabold text-slate-900 text-xl tracking-tight">SNotes</span>
              </Link>
              <p className="max-w-[410px] mt-6 text-sm text-slate-500 leading-relaxed">
                A modern platform to create encrypted notes, protect secret links, set one-time burn timers, and track access safely for modern teams.
              </p>
            </div>
            <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
              {[
                {
                  title: "Product",
                  links: ["Features", "Security", "Dashboard", "Create Note"],
                },
                {
                  title: "Resources",
                  links: ["Documentation", "API Guide", "Security Audit", "FAQs"],
                },
                {
                  title: "Company",
                  links: ["About Us", "Privacy Policy", "Terms of Service", "Contact Us"],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                  <ul className="text-sm space-y-2 text-slate-500">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <a href="#" className="hover:text-[#2F8CFF] hover:underline transition">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <p className="py-6 text-center text-sm md:text-base text-gray-500/80">
            Copyright {new Date().getFullYear()} © <span className="font-semibold text-slate-700">SNotes</span>. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
