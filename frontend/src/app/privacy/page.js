"use client";

import React, { useState, useEffect } from "react";
import { Shield, ArrowLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document.documentElement.classList.contains("dark")) {
      setDarkMode(true);
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`} suppressHydrationWarning>
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <button 
            onClick={() => {
              setDarkMode(!darkMode);
              document.documentElement.classList.toggle("dark");
            }}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <article className="premium-card p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Privacy Policy</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated: June 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              Welcome to <strong>OwnerToRenter</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and store your information when you use our platform to connect directly with house owners and tenants.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">1. Information We Collect</h3>
            <p>
              To provide our commission-free direct matching service, we collect:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li><strong>Personal Details:</strong> Full Name, Email, and Password.</li>
              <li><strong>Contact Information:</strong> Active mobile number and WhatsApp number.</li>
              <li><strong>Verification Information:</strong> Owner CNIC details (for verification badges and quality control checks).</li>
              <li><strong>Listings Details:</strong> Addresses, pricing, rental descriptions, and images uploaded for properties.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">2. How We Use Your Information</h3>
            <p>
              We process your details exclusively to facilitate owner-to-tenant direct interactions:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>To present listing information (phone & WhatsApp) to prospective tenants.</li>
              <li>To perform background trust checks (verifying ownership tags).</li>
              <li>To communicate critical updates regarding listings or your account.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">3. Data Sharing & Third Parties</h3>
            <p>
              Unlike traditional listing brokerages, **we do not sell, rent, or trade your personal data to third parties** for advertisement campaigns. Your contact details are only shared directly with registered users who initiate contact request actions (Call or WhatsApp redirects) on your property.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">4. Security Measures</h3>
            <p>
              We implement industry-standard JWT authentication token parameters, hashed passwords using bcrypt modules, and SQLite/PostgreSQL structural encryptions to secure user files from unauthorized access.
            </p>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        © 2026 OwnerToRenter. Secure Direct Matching Platform.
      </footer>
    </div>
  );
}
