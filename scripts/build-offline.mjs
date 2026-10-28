import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { serviceWorkerSource } from "./offline-worker.mjs";
async function walk(dir) {
  const result = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) result.push(...(await walk(p)));
    else if (e.name !== "sw.js") result.push(p.replace(/^dist\//, ""));
  }
  return result;
}
const assets = await walk("dist");
const { createHash } = await import("node:crypto");
const shellHtml = await readFile("dist/index.html", "utf8");
const hash = createHash("sha256").update(shellHtml).digest("hex").slice(0, 12);
const sw = serviceWorkerSource({
  cacheName: `wellye-${hash}`,
  assets: assets
    .filter((asset) => asset !== "index.html")
    .map((asset) => "./" + asset),
  shellHtml,
});
await writeFile("dist/sw.js", sw);
await writeFile("dist/.nojekyll", "");
console.log("Offline cache:", assets.length, "files");
