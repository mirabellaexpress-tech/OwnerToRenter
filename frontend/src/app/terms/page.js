"use client";

import React, { useState, useEffect } from "react";
import { FileText, ArrowLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Terms of Service</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated: June 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              By accessing the <strong>OwnerToRenter</strong> platform, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before creating listings.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">1. Direct Connection & Broker Ban</h3>
            <p>
              OwnerToRenter is strictly designed for **direct connections between owners and renters**. 
              We strictly prohibit real estate brokers, agents, or commissions of any kind. Any user account found attempting to charge broker fees or acting as a middleman will be permanently banned.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">2. Accuracy of Listings</h3>
            <p>
              Owners must ensure all information, rent prices, deposit requirements, address specs, and uploaded images are accurate and truthful. Placing fake property ads or deceptive information is a violation of these terms.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">3. Verification Badges</h3>
            <p>
              Verified Badges indicate the owner has submitted verification documents (e.g. CNIC checks). However, tenants must perform their own physical inspections of properties and verify documents before signing rental contracts or sending advance security deposits. OwnerToRenter is not liable for off-platform transactions.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">4. Right of Refusal & Listing Removal</h3>
            <p>
              We reserve the right to remove any listing or suspend any user account at our sole discretion, without notice, if we receive complaints or suspect broker activity.
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
