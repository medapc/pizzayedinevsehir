import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const port = Number(process.env.PORT || 4331);
const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function resolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  if (decoded === "/tedarikciLerimiz") return path.join(root, "__pages", "tedarikciLerimiz.html");
  const safe = decoded.replace(/^\/+/, "");
  if (!safe || decoded.endsWith("/")) return path.join(root, safe, "index.html");
  const ext = path.extname(safe);
  return ext ? path.join(root, safe) : path.join(root, safe, "index.html");
}

createServer(async (req, res) => {
  try {
    const file = resolvePath(req.url || "/");
    const bytes = await readFile(file);
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
    res.end(bytes);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Pizza Yedi local copy: http://127.0.0.1:${port}/`);
});



