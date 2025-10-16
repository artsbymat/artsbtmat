import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Copies specific content folders from the `src/content` directory
 * into the `public/content` directory.
 *
 * This function is typically used to synchronize static assets (such as
 * attachments and Excalidraw exports) for public access in a Next.js or
 * similar project. It ensures the destination directory contains only
 * the latest copies by clearing it before copying.
 *
 * Behavior:
 * 1. Defines `srcRoot` (../src/content) and `destRoot` (../public/content).
 * 2. Deletes the existing `public/content` directory if it exists.
 * 3. Recreates `public/content` as a clean folder.
 * 4. Copies the following folders:
 *    - `Attachments` → from `src/content/Attachments`
 *    - `Excalidraw` → from `src/content/05. Outputs/Excalidraw`
 * 5. Logs progress and warnings for missing folders.
 *
 * Example console output:
 * ```
 * 🧹 Cleaned up public/content directory.
 * ✅ Copied Attachments to public/content/Attachments
 * ✅ Copied Excalidraw to public/content/Excalidraw
 * ✨ All folders copied successfully!
 * ```
 *
 * Usage:
 * ```bash
 * node copyAttachments.js
 * ```
 *
 * Notes:
 * - Requires Node.js v16 or higher (for ES Modules and fs.cpSync).
 * - This script permanently deletes `public/content` before copying.
 *   Ensure no manually added files are stored there.
 */
export function copyAttachments() {
  const srcRoot = path.join(__dirname, "../src/content");
  const destRoot = path.join(__dirname, "../public/content");

  const foldersToCopy = [
    { name: "Attachments", src: path.join(srcRoot, "Attachments") },
    { name: "Excalidraw", src: path.join(srcRoot, "05. Outputs/Excalidraw") }
  ];

  // Clean up existing destination folder
  if (fs.existsSync(destRoot)) {
    fs.rmSync(destRoot, { recursive: true, force: true });
    console.log("🧹 Cleaned up public/content directory.");
  }

  fs.mkdirSync(destRoot, { recursive: true });

  // Copy specified folders
  for (const folder of foldersToCopy) {
    if (!fs.existsSync(folder.src)) {
      console.warn(`⚠️ Folder not found: ${folder.src}`);
      continue;
    }

    const dest = path.join(destRoot, folder.name);
    fs.mkdirSync(dest, { recursive: true });

    fs.readdirSync(folder.src).forEach((file) => {
      const srcFile = path.join(folder.src, file);
      const destFile = path.join(dest, file);
      fs.cpSync(srcFile, destFile, { recursive: true });
    });

    console.log(`✅ Copied ${folder.name} to public/content/${folder.name}`);
  }

  console.log("✨ All folders copied successfully!");
}

/**
 * Allows this script to be executed directly via the command line:
 *
 * ```bash
 * node copyAttachments.js
 * ```
 *
 * This conditional ensures the function runs only when the file is
 * executed directly, not when it’s imported as a module.
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  copyAttachments();
}
