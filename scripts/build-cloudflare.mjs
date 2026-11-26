import { mkdir, readdir, copyFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../.cloudflare/assets/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of await readdir(root)) {
  if (name.endsWith(".html")) await copyFile(new URL("../" + name, import.meta.url), new URL(name, output));
}
await copyFile(new URL("ctrb_web_editor_v5.html", output), new URL("index.html", output));
console.log("CTRBooster v5 and browser editor pages staged for Cloudflare");
