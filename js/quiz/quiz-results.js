import { createResultImage, renderResultCanvas } from "../services/resultService.js";

/** Paints the exact same canvas used by the JPG download into the live preview. */
export async function updateResultPreview(canvasElement, details) {
  const rendered = await renderResultCanvas(details);
  canvasElement.width = rendered.width;
  canvasElement.height = rendered.height;
  const context = canvasElement.getContext("2d");
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  context.drawImage(rendered, 0, 0);
}

/** Download a flattened, high-quality JPEG result card. */
export async function downloadActivityResult(details) {
  const blob = await createResultImage(details);
  const url = URL.createObjectURL(blob);
  const safeName = (details.name || "Player").normalize("NFKD").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  const activity = (details.activity || "Activity").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const link = document.createElement("a");
  link.href = url;
  link.download = `LuxChristi-${safeName}-${activity}-Result.jpg`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
