"use client";

import React, { createContext, useContext, ReactNode } from "react";

type ContentData = {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  roast: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
  };
  sandbox: {
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    button1: string;
    button2: string;
    button3: string;
  };
  portfolio: {
    titlePrefix: string;
    titleHighlight: string;
    description: string;
  };
  agent: {
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    systemMsg: string;
    agentMsg1: string;
    agentMsg2: string;
    hireResponse: string;
  };
  services: {
    id: string;
    title: string;
    desc: string;
    specs: string[];
  }[];
  contact: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    successTitle: string;
    successDescription: string;
  };
};

const ContentContext = createContext<ContentData | null>(null);

export function ContentProvider({ children, initialContent }: { children: ReactNode, initialContent: ContentData }) {
  return (
    <ContentContext.Provider value={initialContent}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
