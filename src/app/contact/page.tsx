"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Phone, Send, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

// Dynamically import 3D canvas and morphing globe scene
const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), { ssr: false });
const MorphGlobeScene = dynamic(() => import("@/components/three/MorphGlobeScene"), { ssr: false });

interface FormFields {
  name: string;
  phone: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormFields>({
    name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [activeField, setActiveField] = useState<keyof FormFields | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Compute text length for the 3D globe animation speed
  const textLength = form.name.length + form.email.length + form.phone.length;

  // Real-time validation check
  useEffect(() => {
    const errs: FormErrors = {};
    
    if (form.name && form.name.length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }
    
    if (form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        errs.email = "Please input a valid email address.";
      }
    }
    
    if (form.phone && form.phone.length < 10) {
      errs.phone = "Phone number must be at least 10 digits.";
    }

    setErrors(errs);

    // Form is valid if required fields are filled and there are no errors
    const formHasRequired = !!(form.name && form.email && form.phone);
    const formHasNoErrors = Object.keys(errs).length === 0;
    setIsValid(formHasRequired && formHasNoErrors);
  }, [form]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field: keyof FormFields) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    // Simulate API call to secure the lead
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#02000a] pt-32 pb-24 px-6 overflow-hidden flex items-center justify-center">
      {/* Background glow graphics */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-accent/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side Panel: Form Layer */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          <div>
            <span className="text-[10px] uppercase font-bold text-accent tracking-widest block mb-1">
              Get In Touch
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed mt-4 max-w-md">
              Reach out to us with your details. We will get back to you shortly to discuss your custom project requirements.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col gap-6"
              >
                {/* 1. Name Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Full Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("name")}
                      onBlur={handleBlur}
                      required
                      placeholder="Commander Shepard"
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-white/5 border text-white placeholder-muted-foreground/60 focus:outline-none transition-all duration-300 ${
                        activeField === "name" 
                          ? "border-primary/60 shadow-[0_0_15px_rgba(139,92,246,0.15)] bg-primary/5" 
                          : "border-white/10 hover:border-white/20"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[10px] text-pink-500 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Phone Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Phone Number <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("phone")}
                      onBlur={handleBlur}
                      required
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-white/5 border text-white placeholder-muted-foreground/60 focus:outline-none transition-all duration-300 ${
                        activeField === "phone" 
                          ? "border-accent/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-accent/5" 
                          : "border-white/10 hover:border-white/20"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-pink-500 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Email Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Email Address <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      required
                      placeholder="shepard@alliance.mil"
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-white/5 border text-white placeholder-muted-foreground/60 focus:outline-none transition-all duration-300 ${
                        activeField === "email" 
                          ? "border-primary/60 shadow-[0_0_15px_rgba(139,92,246,0.15)] bg-primary/5" 
                          : "border-white/10 hover:border-white/20"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-pink-500 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-display text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-primary hover:text-white border border-white hover:border-primary disabled:bg-white/10 disabled:text-muted-foreground disabled:border-white/5 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      Sending Details...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send Message
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel-glow p-8 rounded-3xl text-center flex flex-col items-center gap-6 border border-white/10"
              >
                <div className="p-4 bg-accent/15 border border-accent/30 rounded-full text-accent shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
                  Message Sent
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm font-light">
                  Thank you for reaching out! We have received your contact details successfully and our team will get in touch with you shortly.
                </p>
                <button
                  onClick={() => {
                    setForm({ name: "", email: "", phone: "" });
                    setIsSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-colors"
                >
                  Back to Form
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Panel: Interactive 3D Canvas */}
        <div className="lg:col-span-6 h-[400px] lg:h-[550px] relative w-full flex items-center justify-center select-none">
          {/* Ambient wireframe sphere glow backing */}
          <div className="absolute inset-0 m-auto w-64 h-64 bg-primary/10 rounded-full blur-3xl scale-90" />
          
          <SceneCanvas>
            <MorphGlobeScene
              activeField={activeField}
              textLength={textLength}
              isValid={isValid}
            />
          </SceneCanvas>
        </div>

      </div>
    </div>
  );
}
