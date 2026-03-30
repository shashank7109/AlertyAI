/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Changelog | AlertyAI",
  description: "New features, bug fixes, and improvements to the AlertyAI platform.",
  alternates: { canonical: "https://alertyai.com/changelog" },
};

const LOGS = [
  {
    version: "v2.0.0",
    date: "March 29, 2026",
    title: "The Rebranding & Optimization Update",
    badge: "Major",
    changes: [
      "Completely rebranded frontend experience from Smaran to AlertyAI",
      "Massive backend load testing achieving 11,000+ requests with zero failures",
      "Added brand new Terms of Service, Blogs, and Changelog pages",
      "New highly reliable Locust testing scripts for automated load verification"
    ]
  },
  {
    version: "v1.9.0",
    date: "March 25, 2026",
    title: "Android Documentation & Refactoring",
    badge: "Feature",
    changes: [
      "Published Mintlify documentation for the AlertyAI Android App",
      "Finalized Refactron test suite merging 14 boost test files into core frameworks",
      "Fixed Android Dark Mode visual freeze bugs and completely stabilized Glance widget lifecycles"
    ]
  },
  {
    version: "v1.8.5",
    date: "March 20, 2026",
    title: "Authentication Upgrades",
    badge: "Improvement",
    changes: [
      "Added Google OAuth token injection for frontend performance testing",
      "Fixed backend CORS issues with trusted hosts connecting to local environments",
      "Added /api/auth/profile JWT decryption verification"
    ]
  }
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        
        {/* Header Section */}
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-6 tracking-tight uppercase">
            What's <span className="text-[#3ca2fa] italic">New</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Follow along with the latest product updates, bug fixes, and improvements to AlertyAI.
          </p>
        </div>

        {/* Timeline Section */}
        <div className="relative border-l border-border/40 ml-4 md:ml-8 space-y-16">
          {LOGS.map((log, index) => (
            <div key={index} className="relative pl-8 md:pl-16">
              
              {/* Timeline Dot */}
              <div 
                className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-2 ${
                  log.badge === 'Major' 
                    ? 'bg-[#3ca2fa] shadow-[0_0_10px_#3ca2fa]' 
                    : 'bg-border'
                }`} 
              />
              
              {/* Desktop Horizon Line */}
              <div className="absolute hidden md:block w-8 h-[1px] bg-border/40 top-3.5 left-0" />

              <div className="flex flex-col md:flex-row md:items-baseline mb-3">
                <span className="text-text-secondary text-sm font-bold tracking-widest uppercase mb-2 md:mb-0 md:w-36 shrink-0">
                  {log.date}
                </span>
                <div className="flex items-center flex-wrap gap-3">
                  <h2 className="text-2xl font-bold font-heading tracking-tight text-on-surface">
                    {log.title}
                  </h2>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    log.badge === 'Major' 
                      ? 'bg-[#3ca2fa]/20 text-[#3ca2fa]' 
                      : 'bg-surface-hover text-text-secondary'
                  }`}>
                    {log.version}
                  </span>
                </div>
              </div>

              <div className="bg-[#1E1E23]/30 border border-border/40 rounded-2xl p-6 mt-4 md:ml-[9rem]">
                <ul className="space-y-3">
                  {log.changes.map((change, i) => (
                    <li key={i} className="flex relative pl-5 text-text-secondary font-medium leading-relaxed">
                      <span className="absolute left-0 top-[0.6rem] w-2 h-2 rounded-full border border-border/80 bg-background" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  );
}
