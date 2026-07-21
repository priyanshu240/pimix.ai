"use client";

import React, { useEffect, useState } from "react";
import { Scale, Shield, Cookie, Accessibility, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Tab = "privacy" | "terms" | "cookies" | "accessibility";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<Tab>("privacy");

  useEffect(() => {
    // Listen to hash changes in the URL to show the correct section
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as Tab;
      if (["privacy", "terms", "cookies", "accessibility"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange(); // Run once on load
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold uppercase tracking-tight mb-4">
            Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Documentation</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base">
            Review our policies, terms of service, and compliance disclosures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Navigation Sidebar */}
          <nav className="lg:col-span-4 flex flex-col gap-2 glass-panel p-4 rounded-2xl">
            {[
              { id: "privacy", label: "Privacy Policy", icon: Shield },
              { id: "terms", label: "Terms of Service", icon: Scale },
              { id: "cookies", label: "Cookie Preferences", icon: Cookie },
              { id: "accessibility", label: "Accessibility Statement", icon: Accessibility },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </a>
              );
            })}
          </nav>

          {/* Content Pane */}
          <div className="lg:col-span-8 glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden min-h-[500px]">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2 text-emerald-400">
                  <Shield className="w-6 h-6" /> Privacy Policy
                </h2>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Last Updated: July 2026
                </p>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  At pimix.ai, we prioritize the protection and confidentiality of your personal information. This Privacy Policy details how we collect, process, and protect your digital telemetry and details when interacting with our online services.
                </p>
                <h3 className="text-lg font-bold text-white mt-8">1. Telemetry Collection</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  We gather diagnostic logs, IP addresses, browser specifications, and user interactions when you navigate our WebGL nodes and interface components to optimize rendering efficiency.
                </p>
                <h3 className="text-lg font-bold text-white">2. Data Usage Parameters</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  All personal contact data submitted through our request forms is kept strictly confidential and used solely to review technical project requirements and schedule discovery calendars. We never sell your data.
                </p>
              </div>
            )}

            {activeTab === "terms" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2 text-emerald-400">
                  <Scale className="w-6 h-6" /> Terms of Service
                </h2>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Last Updated: July 2026
                </p>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  By accessing and browsing the pimix.ai website, you acknowledge and agree to the following terms, conditions, and operational parameters.
                </p>
                <h3 className="text-lg font-bold text-white mt-8">1. Proprietary Digital Assets</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  All 3D models, shaders, particle networks, responsive components, and custom AI agent codeblocks rendered on this domain are the intellectual property of pimix.ai and cannot be reverse-engineered or redistributed without explicit authorization.
                </p>
                <h3 className="text-lg font-bold text-white">2. Operational Disclaimers</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  Our interactive sandboxes, custom AI agents, and Lighthouse simulator audits are designed to demonstrate engineering capacity. Performance scores and results generated during audits are simulated telemetry.
                </p>
              </div>
            )}

            {activeTab === "cookies" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2 text-emerald-400">
                  <Cookie className="w-6 h-6" /> Cookie Preferences
                </h2>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Last Updated: July 2026
                </p>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  Our platform uses essential state-management cookies and browser memory nodes to optimize user experience and store custom theme preferences.
                </p>
                <h3 className="text-lg font-bold text-white mt-8">1. Essential Memory Nodes</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  These cookies are required to preserve active settings, such as your custom site color overrides, sandbox configuration selections, and living chatbot conversation history logs.
                </p>
                <h3 className="text-lg font-bold text-white">2. Diagnostic Analytics</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  We use cookies to measure page load rates, canvas render failures, and scroll depths to ensure consistent UI response times across various devices and hardware accelerators.
                </p>
              </div>
            )}

            {activeTab === "accessibility" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2 text-emerald-400">
                  <Accessibility className="w-6 h-6" /> Accessibility Statement
                </h2>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Last Updated: July 2026
                </p>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  pimix.ai is committed to ensuring digital accessibility for all users, including those utilizing screen readers or keyboard navigation.
                </p>
                <h3 className="text-lg font-bold text-white mt-8">1. Compliance Targets</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  We actively design our components to align with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA parameters, ensuring high color contrast ratios, relative sizing nodes, and responsive formatting.
                </p>
                <h3 className="text-lg font-bold text-white">2. Keyboard & Screen Navigation</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  All links, forms, and custom SVGs within our agency site have unique `id` and `aria-label` tags to facilitate standard screen reader speech synthesis and tab key accessibility.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
