import { build } from "vite";
import { profile } from "../src/data.js";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const root = fileURLToPath(new URL("..", import.meta.url));
const destination = path.resolve(
  process.argv[2] || path.join(root, "../portfolio-preview.html"),
);
const result = await build({
  root,
  configFile: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    write: false,
    lib: {
      entry: path.join(root, "src/main.jsx"),
      name: "Portfolio",
      formats: ["iife"],
    },
    minify: true,
    cssCodeSplit: false,
  },
});
const output = (Array.isArray(result) ? result : [result]).flatMap(
  (item) => item.output,
);
const js = output
  .filter((item) => item.type === "chunk")
  .map((item) => item.code)
  .join("\n");
const css = output
  .filter((item) => item.type === "asset" && item.fileName.endsWith(".css"))
  .map((item) => item.source)
  .join("\n");
if (!js || !css)
  throw new Error("Preview bundle is missing JavaScript or styles.");
if (/url\((?!['"]?data:)/.test(css))
  throw new Error("Preview styles contain a nonembedded asset.");

const mimeTypes = {
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};
const assets = {};
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(filename);
    else {
      const mime = mimeTypes[path.extname(entry.name).toLowerCase()];
      if (mime)
        assets[
          "/" +
            path
              .relative(path.join(root, "public"), filename)
              .split(path.sep)
              .join("/")
        ] = { mime, base64: (await readFile(filename)).toString("base64") };
    }
  }
}
await collect(path.join(root, "public"));
const bootstrap = `globalThis.__PORTFOLIO_ASSETS__ = Object.fromEntries(Object.entries(${JSON.stringify(assets)}).map(([name,asset]) => [name,URL.createObjectURL(new Blob([Uint8Array.from(atob(asset.base64),c=>c.charCodeAt(0))],{type:asset.mime}))]));`;
const favicon = assets["/favicon.svg"];
const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#171919"><title>${profile.fullName} — Portfolio Preview</title><link rel="icon" href="data:${favicon.mime};base64,${favicon.base64}"><style>${css.replace(/<\/style/gi, "<\\/style")}</style></head>
<body><div id="root"></div><script>${(bootstrap + "\n" + js).replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(
  `Offline preview written to ${destination} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`,
);
const archivePath = path.join(
  path.dirname(destination),
  "alejandro-portfolio-preview.zip",
);
await promisify(execFile)("python3", [
  "-c",
  `
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import sys
preview = Path(sys.argv[1])
with ZipFile(sys.argv[2], 'w', ZIP_DEFLATED) as archive:
    archive.write(preview, 'portfolio-preview.html')
    archive.writestr('OPEN-ME.txt', 'Extract this ZIP, then double-click portfolio-preview.html to open it in a browser.\\nThe top-right menu opens Home, Projects, and Research publications. Each project opens its own page.\\nThe page, images, fonts, and resume are embedded, so no server or installation is needed.\\n')
`,
  destination,
  archivePath,
]);
console.log(`Downloadable ZIP written to ${archivePath}`);
