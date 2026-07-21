"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const contentFilePath = path.join(process.cwd(), "src", "data", "content.json");

export async function getContent() {
  try {
    const fileContents = fs.readFileSync(contentFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading content.json:", error);
    return null;
  }
}

export async function updateContent(newContent: any) {
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(newContent, null, 2), "utf8");
    // Revalidate the entire site so the layout/pages pick up the new data
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error writing content.json:", error);
    return { success: false, error: "Failed to save content." };
  }
}
