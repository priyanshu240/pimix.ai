"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUp, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight
} from "lucide-react";

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Dynamic back-to-top visibility based on scroll depth
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#0a0a0a] text-white pt-20 pb-10 border-t border-white/10 z-50 font-sans">
      
      {/* Visual Design: Subtle abstract gravity/weightlessness element */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        
        {/* Column 1: Brand Identity & Introduction */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded">
            <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Antigravity</h2>
          </Link>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Crafting interactive, high-performance web experiences. Defying digital constraints through elite engineering.
          </p>
          <address className="flex flex-col gap-3 mt-2 text-sm text-zinc-300 not-italic">
            <a href="https://maps.google.com" className="flex items-start gap-3 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1 -ml-1">
              <MapPin className="w-5 h-5 text-zinc-500 group-hover:text-emerald-500 transition-colors shrink-0" />
              <span>123 Innovation Drive, Tech District<br/>San Francisco, CA 94103</span>
            </a>
            <a href="tel:+15551234567" className="flex items-center gap-3 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1 -ml-1">
              <Phone className="w-5 h-5 text-zinc-500 group-hover:text-emerald-500 transition-colors shrink-0" />
              <span>+1 (555) 123-4567</span>
            </a>
            <a href="mailto:hello@antigravity.dev" className="flex items-center gap-3 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1 -ml-1">
              <Mail className="w-5 h-5 text-zinc-500 group-hover:text-emerald-500 transition-colors shrink-0" />
              <span>hello@antigravity.dev</span>
            </a>
          </address>
        </div>

        {/* Column 2: Secondary Navigation (Quick Links) */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100">Quick Links</h3>
          <ul className="flex flex-col gap-4">
            {[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Portfolios / Case Studies", path: "/portfolio" },
              { name: "About Us / Our Process", path: "/about" },
              { name: "Contact Page", path: "/contact" },
            ].map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.path} 
                  className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 -ml-1 inline-flex"
                >
                  <span className="w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-3" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resource Center (Insights) */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100">Insights & Resources</h3>
          <ul className="flex flex-col gap-4">
            {[
              { title: "The Future of DOM Automation in AI", date: "Oct 12, 2026" },
              { title: "Optimizing Next.js for 100/100 Lighthouse", date: "Sep 28, 2026" },
              { title: "Case Study: Scaling to 1M Monthly Visitors", date: "Sep 15, 2026" },
              { title: "Why Scrollytelling is the New Standard", date: "Aug 30, 2026" },
            ].map((post, idx) => (
              <li key={idx}>
                <Link 
                  href="#" 
                  className="group flex flex-col gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1 -ml-1"
                >
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-tight">
                    {post.title}
                  </span>
                  <span className="text-xs text-zinc-600 font-mono">
                    {post.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Social Proof & Connectivity */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100">Connect</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {[
              { icon: LinkedinIcon, href: "#", label: "LinkedIn Profile" },
              { icon: TwitterIcon, href: "#", label: "Twitter Profile" },
              { icon: GithubIcon, href: "#", label: "GitHub Repository" },
              { icon: YoutubeIcon, href: "#", label: "YouTube Channel" },
              { icon: InstagramIcon, href: "#", label: "Instagram Profile" },
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a 
                  key={idx} 
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Persistent CTA */}
          <div className="mt-2 flex flex-col gap-3 p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
            <h4 className="text-sm font-semibold text-white">Ready to elevate your brand?</h4>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-black text-sm font-bold rounded-lg hover:bg-emerald-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Discuss Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Legal & Copyright */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Antigravity. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/privacy" className="text-xs text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">Privacy Policy</Link>
          <Link href="/terms" className="text-xs text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">Terms of Service</Link>
          <Link href="/cookies" className="text-xs text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">Cookie Preferences</Link>
          <Link href="/accessibility" className="text-xs text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">Accessibility Statement</Link>
        </div>
      </div>

      {/* Interactive Back to Top Navigation */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            aria-label="Back to top of page"
            title="Back to Top"
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 p-3 rounded-full bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </footer>
  );
}
