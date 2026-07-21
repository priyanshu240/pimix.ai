"use client";

import React, { useState } from "react";
import { useContent } from "@/contexts/ContentContext";
import { updateContent } from "@/actions/contentActions";
import { Save, AlertCircle, CheckCircle, Database, LayoutTemplate, MessageSquare, Terminal } from "lucide-react";

export default function AdminDashboard() {
  const content = useContent();
  const [formData, setFormData] = useState(content);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handleChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setStatus("saving");
    const res = await updateContent(formData);
    if (res.success) {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
          <Database className="w-8 h-8 text-emerald-500" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Content Management</h1>
            <p className="text-zinc-500 text-sm mt-1">Live updates via JSON Store & Server Actions.</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* HERO SECTION */}
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5" /> Hero Section
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Main Title (HTML allowed for breaks)</label>
                <input 
                  type="text" 
                  value={formData.hero.title}
                  onChange={(e) => handleChange("hero", "title", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Subtitle / Floating Text</label>
                <input 
                  type="text" 
                  value={formData.hero.subtitle}
                  onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Main Body Description</label>
                <textarea 
                  value={formData.hero.description}
                  onChange={(e) => handleChange("hero", "description", e.target.value)}
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* SANDBOX SECTION */}
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-500 mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5" /> Interactive Sandbox
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title Prefix</label>
                  <input 
                    type="text" 
                    value={formData.sandbox.titlePrefix}
                    onChange={(e) => handleChange("sandbox", "titlePrefix", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title Highlight</label>
                  <input 
                    type="text" 
                    value={formData.sandbox.titleHighlight}
                    onChange={(e) => handleChange("sandbox", "titleHighlight", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea 
                  value={formData.sandbox.description}
                  onChange={(e) => handleChange("sandbox", "description", e.target.value)}
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Button 1</label>
                  <input type="text" value={formData.sandbox.button1} onChange={(e) => handleChange("sandbox", "button1", e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Button 2</label>
                  <input type="text" value={formData.sandbox.button2} onChange={(e) => handleChange("sandbox", "button2", e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Button 3</label>
                  <input type="text" value={formData.sandbox.button3} onChange={(e) => handleChange("sandbox", "button3", e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
              </div>
            </div>
          </section>

          {/* PORTFOLIO SECTION */}
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold uppercase tracking-widest text-blue-500 mb-6 border-b border-white/10 pb-2">Portfolio / Masterpieces</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title Prefix</label>
                  <input 
                    type="text" 
                    value={formData.portfolio.titlePrefix}
                    onChange={(e) => handleChange("portfolio", "titlePrefix", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title Highlight</label>
                  <input 
                    type="text" 
                    value={formData.portfolio.titleHighlight}
                    onChange={(e) => handleChange("portfolio", "titleHighlight", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea 
                  value={formData.portfolio.description}
                  onChange={(e) => handleChange("portfolio", "description", e.target.value)}
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* ROAST SECTION */}
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold uppercase tracking-widest text-red-500 mb-6 border-b border-white/10 pb-2">Performance Roast</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Badge Text</label>
                <input 
                  type="text" 
                  value={formData.roast.badge}
                  onChange={(e) => handleChange("roast", "badge", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title Prefix</label>
                  <input 
                    type="text" 
                    value={formData.roast.titlePrefix}
                    onChange={(e) => handleChange("roast", "titlePrefix", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title Highlight</label>
                  <input 
                    type="text" 
                    value={formData.roast.titleHighlight}
                    onChange={(e) => handleChange("roast", "titleHighlight", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea 
                  value={formData.roast.description}
                  onChange={(e) => handleChange("roast", "description", e.target.value)}
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* LIVING AGENT SECTION */}
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold uppercase tracking-widest text-purple-500 mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Living Agent
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title Prefix</label>
                  <input 
                    type="text" 
                    value={formData.agent.titlePrefix}
                    onChange={(e) => handleChange("agent", "titlePrefix", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Title Highlight</label>
                  <input 
                    type="text" 
                    value={formData.agent.titleHighlight}
                    onChange={(e) => handleChange("agent", "titleHighlight", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Section Description</label>
                <textarea 
                  value={formData.agent.description}
                  onChange={(e) => handleChange("agent", "description", e.target.value)}
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>
              
              <div className="mt-8 border-t border-white/10 pt-6 space-y-6">
                 <h3 className="text-sm font-bold uppercase text-zinc-500">Bot Logic & Responses</h3>
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">System Boot Message</label>
                    <input type="text" value={formData.agent.systemMsg} onChange={(e) => handleChange("agent", "systemMsg", e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm text-green-400" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Intro Message 1</label>
                    <input type="text" value={formData.agent.agentMsg1} onChange={(e) => handleChange("agent", "agentMsg1", e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Intro Message 2 (Hints)</label>
                    <input type="text" value={formData.agent.agentMsg2} onChange={(e) => handleChange("agent", "agentMsg2", e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Lead Qualification Response (Pricing/Hire)</label>
                    <textarea value={formData.agent.hireResponse} onChange={(e) => handleChange("agent", "hireResponse", e.target.value)} rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none" />
                 </div>
              </div>
            </div>
          </section>

        </div>

        {/* Action Bar */}
        <div className="mt-10 flex items-center justify-between bg-black border border-white/10 p-6 rounded-2xl sticky bottom-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
          <div className="flex items-center gap-3">
            {status === "saving" && <span className="text-emerald-500 text-sm flex items-center gap-2 animate-pulse"><Save className="w-4 h-4" /> Saving to disk...</span>}
            {status === "success" && <span className="text-emerald-500 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Live site updated!</span>}
            {status === "error" && <span className="text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Failed to save</span>}
            {status === "idle" && <span className="text-zinc-500 text-sm">Unsaved changes will be lost on refresh.</span>}
          </div>
          
          <button 
            onClick={handleSave}
            disabled={status === "saving"}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            Publish Changes
          </button>
        </div>
      </div>
    </div>
  );
}
