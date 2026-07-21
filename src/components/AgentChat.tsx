"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Send, Command } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

type Message = {
  role: "system" | "user" | "agent";
  content: string;
};

export default function AgentChat() {
  const content = useContent();
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: content.agent.systemMsg },
    { role: "agent", content: content.agent.agentMsg1 },
    { role: "agent", content: content.agent.agentMsg2 }
  ]);
  const [input, setInput] = useState("");
  const [isRedTheme, setIsRedTheme] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCommand = (cmd: string) => {
    const text = cmd.toLowerCase();
    
    // DOM Manipulation: Scrolling
    if (text.includes("scroll down") || text.includes("go down")) {
      window.scrollBy({ top: 800, left: 0, behavior: "smooth" });
      return "Executing DOM command: Scrolling down the page for you...";
    }
    
    if (text.includes("scroll up") || text.includes("go up")) {
      window.scrollBy({ top: -800, left: 0, behavior: "smooth" });
      return "Executing DOM command: Scrolling up the page...";
    }

    // DOM Manipulation: Theming
    if (text.includes("red theme") || text.includes("red") || text.includes("color")) {
      setIsRedTheme(true);
      setTimeout(() => {
         setIsRedTheme(false);
      }, 10000); // Increased to 10 seconds per user request
      return "Executing DOM override: Applying Red/Cyberpunk filter to the entire website for 10 seconds...";
    }

    // Lead Qualification Logic
    if (text.includes("hire") || text.includes("contact") || text.includes("price") || text.includes("cost") || text.includes("how much")) {
      return content.agent.hireResponse;
    }
    
    if (text === "yes") {
        return "Redirecting to scheduling interface... (In production, this triggers a Calendly popup).";
    }

    // Fallback response
    return `I processed your input: "${cmd}". In a production environment, this triggers our LLM Lambda function. For this demo, try typing 'scroll down' or 'red theme'.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const userInput = input;
    setInput("");

    // Simulate AI thinking delay
    setTimeout(() => {
      const responseContent = handleCommand(userInput);
      const agentMessage: Message = { role: "agent", content: responseContent };
      setMessages(prev => [...prev, agentMessage]);
    }, 600);
  };

  return (
    <>
      {isRedTheme && (
        <div className="fixed inset-0 z-[9999] pointer-events-none border-[16px] border-red-600/80 bg-red-900/20 mix-blend-lighten shadow-[inset_0_0_150px_rgba(220,38,38,0.5)] transition-opacity duration-1000" />
      )}
      <section className="relative w-full py-24 bg-transparent border-t border-white/5 font-mono">
        <div className="max-w-4xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center rounded-xl text-emerald-500">
              <Terminal className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tight">
                {content.agent.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{content.agent.titleHighlight}</span>
              </h2>
              <p className="text-emerald-400/70 text-sm mt-1">{content.agent.description}</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400">
            Status: <span className="text-emerald-500 animate-pulse inline-block w-2 h-2 bg-emerald-500 rounded-full ml-1" /> Online
          </div>
        </div>

        <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[450px]">
          
          {/* Terminal Header */}
          <div className="bg-black border-b border-white/5 p-3 flex items-center gap-2">
            <div className="flex gap-1.5 ml-2">
               <div className="w-3 h-3 rounded-full bg-red-500/50" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
               <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-xs text-zinc-500 ml-4 flex items-center gap-2">
              <Command className="w-3 h-3" />
              agent.pimix.dev/console
            </div>
          </div>

          {/* Chat Window */}
          <div ref={chatRef} className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth">
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] md:max-w-[75%] rounded-xl px-4 py-3 text-sm md:text-base leading-relaxed ${
                  msg.role === "system" ? "bg-red-500/10 text-red-400 border border-red-500/20 font-bold" :
                  msg.role === "user" ? "bg-zinc-800 text-zinc-200" :
                  "bg-emerald-900/10 text-emerald-300 border border-emerald-500/20"
                }`}>
                  {msg.role === "agent" && <span className="font-bold mr-2 text-emerald-500">AGNT_01:</span>}
                  {msg.role === "system" && <span className="font-bold mr-2 text-red-500">SYS_WARN:</span>}
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 bg-zinc-900 border-t border-white/5 flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. 'scroll down', 'red theme', 'hire'"
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black px-6 rounded-xl font-bold transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

        </div>
      </div>
      </section>
    </>
  );
}
