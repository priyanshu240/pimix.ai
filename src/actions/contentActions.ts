"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const contentFilePath = path.join(process.cwd(), "src", "data", "content.json");

// Helper to check if KV credentials are available
const hasKVCredentials = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// Custom zero-dependency Upstash Redis REST Client
async function runKVCommand(command: string[]) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Missing KV credentials");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    // Ensure Next.js doesn't cache this fetch so we get live data
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`KV Command failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

export async function getContent() {
  // 1. Try fetching from Upstash KV
  if (hasKVCredentials()) {
    try {
      const dataStr = await runKVCommand(["GET", "site_content"]);
      if (dataStr) {
        return JSON.parse(dataStr);
      }
      console.log("No content found in KV, falling back to local file...");
    } catch (error) {
      console.error("Failed to fetch from Upstash KV:", error);
    }
  }

  // 2. Fallback to local file read
  try {
    const fileContents = fs.readFileSync(contentFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading content.json:", error);
    return null;
  }
}

export async function updateContent(newContent: any) {
  let savedToKV = false;
  let savedToFile = false;
  let kvError = null;

  // 1. Try saving to Upstash KV
  if (hasKVCredentials()) {
    try {
      await runKVCommand(["SET", "site_content", JSON.stringify(newContent)]);
      savedToKV = true;
    } catch (error) {
      console.error("Failed to save to Upstash KV:", error);
      kvError = (error as Error).message;
    }
  }

  // 2. Try saving to local file (mainly for local development sync)
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(newContent, null, 2), "utf8");
    savedToFile = true;
  } catch (error) {
    // Expected to fail in read-only production environments like Vercel
    console.log("Local file write skipped (production read-only)");
  }

  // Determine success: if we are on Vercel we require KV success. If local, we require file success.
  const success = hasKVCredentials() ? savedToKV : savedToFile;

  if (success) {
    revalidatePath("/", "layout");
    return { success: true };
  } else {
    return { 
      success: false, 
      error: kvError || "Failed to write to storage." 
    };
  }
}

const leadsFilePath = path.join(process.cwd(), "src", "data", "leads.json");

export async function submitContactMessage(message: { name: string; phone: string; email: string }) {
  const newMessage = {
    ...message,
    timestamp: new Date().toISOString()
  };

  if (hasKVCredentials()) {
    try {
      const dataStr = await runKVCommand(["GET", "contact_messages"]);
      let messages = [];
      if (dataStr) {
        messages = JSON.parse(dataStr);
      }
      messages.unshift(newMessage);
      await runKVCommand(["SET", "contact_messages", JSON.stringify(messages)]);
      return { success: true };
    } catch (error) {
      console.error("Failed to save contact message to KV:", error);
    }
  }

  // Fallback to local file
  try {
    let messages = [];
    if (fs.existsSync(leadsFilePath)) {
      const fileContents = fs.readFileSync(leadsFilePath, "utf8");
      messages = JSON.parse(fileContents);
    }
    messages.unshift(newMessage);
    fs.writeFileSync(leadsFilePath, JSON.stringify(messages, null, 2), "utf8");
    return { success: true };
  } catch (error) {
    console.error("Error writing leads.json:", error);
    return { success: false, error: "Failed to write to local lead storage." };
  }
}

export async function getContactMessages() {
  if (hasKVCredentials()) {
    try {
      const dataStr = await runKVCommand(["GET", "contact_messages"]);
      if (dataStr) {
        return { success: true, messages: JSON.parse(dataStr) };
      }
      return { success: true, messages: [] };
    } catch (error) {
      console.error("Failed to fetch contact messages from KV:", error);
    }
  }

  // Fallback to local file
  try {
    if (fs.existsSync(leadsFilePath)) {
      const fileContents = fs.readFileSync(leadsFilePath, "utf8");
      return { success: true, messages: JSON.parse(fileContents) };
    }
    return { success: true, messages: [] };
  } catch (error) {
    console.error("Error reading leads.json:", error);
    return { success: false, messages: [] };
  }
}

export async function clearContactMessages() {
  if (hasKVCredentials()) {
    try {
      await runKVCommand(["SET", "contact_messages", JSON.stringify([])]);
      return { success: true };
    } catch (error) {
      console.error("Failed to clear contact messages in KV:", error);
    }
  }

  // Fallback to local file
  try {
    fs.writeFileSync(leadsFilePath, JSON.stringify([], null, 2), "utf8");
    return { success: true };
  } catch (error) {
    console.error("Error clearing leads.json:", error);
    return { success: false };
  }
}
