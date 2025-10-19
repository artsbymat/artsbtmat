import fs from "fs";
import path from "path";

/**
 * Get all JSON files inside a directory (recursively) and return their parsed data
 * along with a slug derived from the filename.
 *
 * @param {string} baseDir - Base directory, e.g. "src/content/05. Outputs/Static"
 * @returns {Array<{ slug: string, data: any }>}
 */
export function getAllStaticJSON(baseDir = "src/content/05. Outputs/Static") {
  const results = [];

  function readDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        readDirectory(fullPath);
      } else if (item.isFile() && item.name.endsWith(".json")) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          const data = JSON.parse(content);

          const slug = path.basename(item.name, ".json");

          results.push({ slug, data });
        } catch (error) {
          console.error(`❌ Failed to parse ${fullPath}:`, error);
        }
      }
    }
  }

  readDirectory(baseDir);
  return results;
}
