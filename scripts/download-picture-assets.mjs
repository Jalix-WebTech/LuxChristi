/** Download the referenced Wikimedia Commons picture-quiz images into the local assets folder. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, "assets/images/quiz/picture-quiz/sources.json");
const destination = resolve(root, "assets/images/quiz/picture-quiz");
const sources = JSON.parse(await readFile(manifestPath, "utf8"));
await mkdir(destination, { recursive: true });
let failures = 0;

for (const item of sources) {
  const response = await fetch(item.url, {
    headers: { "User-Agent": "LuxChristiLearningPlatform/1.0 (educational picture quiz)" },
    redirect: "follow"
  });
  const type = response.headers.get("content-type") || "";
  if (!response.ok || !type.startsWith("image/")) {
    failures += 1;
    console.error(`FAILED ${item.file}: HTTP ${response.status}; content-type=${type}`);
    continue;
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(resolve(destination, item.file), bytes);
  console.log(`SAVED ${item.file} (${Math.round(bytes.byteLength / 1024)} KB)`);
}

if (failures) {
  console.error(`${failures} image(s) could not be downloaded. Review the source pages and licences before redistribution.`);
  process.exitCode = 1;
} else {
  console.log(`All ${sources.length} picture assets were downloaded. Keep the source and licence information with the project.`);
}
