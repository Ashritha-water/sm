// Post-build fix for the static export.
// Next.js writes route-segment prefetch files into nested folders, e.g.
//   out/services/web-development/__next.services/$d$slug/__PAGE__.txt
// but the browser requests the dot-joined name, e.g.
//   out/services/web-development/__next.services.$d$slug.__PAGE__.txt
// Static hosts like S3 have no rewrites, so we copy each file to the requested name.
import { copyFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const out = path.resolve(process.argv[2] ?? "out");
let copied = 0;

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of filesUnder(p)) {
        const flat = path.join(dir, path.relative(dir, file).split(path.sep).join("."));
        copyFileSync(file, flat);
        copied++;
      }
    } else {
      walk(p);
    }
  }
}

walk(out);
console.log(`flatten-segments: wrote ${copied} prefetch file(s) in ${path.relative(process.cwd(), out) || "."}`);
