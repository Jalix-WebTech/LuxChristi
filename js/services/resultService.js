// Canvas-based result renderer. It creates a flattened JPG; it is not proof of
// an official score. Official records must be verified by a trusted backend.
const WIDTH = 1200;
const HEIGHT = 1500;

export async function renderResultCanvas(details) {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering is not supported by this browser.");

  const tier = details.achievement;
  const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, "#10213b");
  background.addColorStop(1, "#1b3454");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = tier.theme;
  ctx.lineWidth = 12;
  ctx.strokeRect(36, 36, WIDTH - 72, HEIGHT - 72);
  ctx.strokeStyle = "#d7ad58";
  ctx.lineWidth = 2;
  ctx.strokeRect(55, 55, WIDTH - 110, HEIGHT - 110);

  // Subtle decorative rays keep the card distinctive without crowding it.
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = tier.theme;
  for (let i = 0; i < 18; i += 1) {
    ctx.beginPath();
    ctx.moveTo(600, 0);
    ctx.lineTo(600 + Math.cos(i * Math.PI / 9) * 900, Math.sin(i * Math.PI / 9) * 900);
    ctx.lineTo(600 + Math.cos((i + 0.35) * Math.PI / 9) * 900, Math.sin((i + 0.35) * Math.PI / 9) * 900);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = "#d7ad58";
  ctx.font = "bold 34px Arial";
  ctx.fillText("✦  LUX CHRISTI  ✦", 600, 135);
  ctx.fillStyle = "#ffffff";
  ctx.font = "52px Georgia";
  ctx.fillText("ACTIVITY ACHIEVEMENT", 600, 220);
  ctx.fillStyle = tier.theme;
  ctx.font = "bold 32px Arial";
  ctx.fillText(`${tier.badge}  ${tier.title.toUpperCase()}  ${tier.badge}`, 600, 285);
  ctx.fillStyle = "#f0d99f";
  ctx.font = "bold 34px Arial";
  ctx.fillText("★ ".repeat(tier.stars).trim(), 600, 340);

  if (details.photoImage) drawCircularImage(ctx, details.photoImage, 600, 510, 125, details.photoCrop);
  else drawInitials(ctx, details.name, 600, 510, 125);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 46px Arial";
  ctx.fillText(fitText(ctx, details.name || "Lux Christi Learner", 980, 46), 600, 700);

  // Community details are optional. Each supplied value gets a bold label and
  // value; empty fields are omitted entirely. Long entries wrap within the card.
  const community = getCommunityDetails(details);
  let communityLineCount = 0;
  const communityStartY = 755;
  ctx.fillStyle = "#f4e5bd";
  ctx.font = "bold 25px Arial";
  community.forEach(([label, rawValue]) => {
    const lines = wrapText(ctx, `${label}: ${String(rawValue).trim()}`, 1020);
    lines.forEach(line => {
      ctx.fillText(line, 600, communityStartY + communityLineCount * 32);
      communityLineCount += 1;
    });
    communityLineCount += 0.25;
  });

  const activityY = communityStartY + communityLineCount * 32 + 22;
  ctx.fillStyle = "#d7ad58";
  ctx.font = "bold 24px Arial";
  ctx.fillText(fitText(ctx, `${details.activity || "ACTIVITY"} · ${details.selection || "Challenge"}`, 1000, 24), 600, activityY);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 29px Arial";
  ctx.fillText("FINAL SCORE", 600, activityY + 78);
  ctx.fillStyle = tier.theme;
  ctx.font = "bold 100px Georgia";
  ctx.fillText(Number(details.score || 0).toLocaleString(), 600, activityY + 190);
  ctx.fillStyle = "#dbe3ed";
  ctx.font = "28px Arial";
  ctx.fillText(`${Number(details.accuracy || 0)}% accuracy  ·  ${Number(details.correct || 0)} correct`, 600, activityY + 245);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "22px Arial";
  ctx.fillText(`${Number(details.incorrect || 0)} incorrect  ·  ${Number(details.unanswered || 0)} unanswered  ·  ${Number(details.averageResponseSeconds || 0).toFixed(1)}s average`, 600, activityY + 292);
  ctx.fillStyle = "#f0d99f";
  ctx.font = "bold 25px Arial";
  ctx.fillText(fitText(ctx, tier.message, 980, 25), 600, 1335);
  ctx.fillStyle = "#c6cfdb";
  ctx.font = "22px Arial";
  ctx.fillText(details.completionDate || new Date().toLocaleDateString(), 600, 1400);
  ctx.font = "18px Arial";
  ctx.fillText("Learn with purpose. Play with joy. Grow in faith.", 600, 1440);
  return canvas;
}

export async function createResultImage(details) {
  const canvas = await renderResultCanvas(details);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("The browser could not encode the JPG result image.")), "image/jpeg", 0.94);
  });
}

/** Return only community details the player actually supplied. */
export function getCommunityDetails(details = {}) {
  return [
    ["Diocese", details.diocese],
    ["Deanery", details.deanery],
    ["Parish", details.parish],
  ].map(([label, value]) => [label, String(value || "").trim()])
    .filter(([, value]) => value.length > 0);
}

/** Wrap canvas text by words and, if needed, by characters in a long word. */
function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach(word => {
    // Split unusually long unbroken entries so they cannot run outside the card.
    let remaining = word;
    while (ctx.measureText(remaining).width > maxWidth) {
      let splitAt = 1;
      while (splitAt < remaining.length && ctx.measureText(remaining.slice(0, splitAt + 1)).width <= maxWidth) splitAt += 1;
      const piece = remaining.slice(0, splitAt);
      const candidate = line ? `${line} ${piece}` : piece;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = piece;
      } else {
        line = candidate;
      }
      remaining = remaining.slice(splitAt);
      lines.push(line);
      line = "";
    }
    const candidate = line ? `${line} ${remaining}` : remaining;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = remaining;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function fitText(ctx, text, maxWidth, fontSize) {
  let size = fontSize;
  ctx.font = `${ctx.font.includes("bold") ? "bold " : ""}${size}px Arial`;
  while (ctx.measureText(String(text)).width > maxWidth && size > 16) {
    size -= 1;
    ctx.font = `${size}px Arial`;
  }
  return String(text);
}

function drawCircularImage(ctx, image, x, y, radius, crop = { zoom: 1, offsetX: 0, offsetY: 0 }) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  const baseScale = Math.max((radius * 2) / image.width, (radius * 2) / image.height);
  const scale = baseScale * (crop.zoom || 1);
  const width = image.width * scale;
  const height = image.height * scale;
  ctx.drawImage(image, x - width / 2 + (crop.offsetX || 0), y - height / 2 + (crop.offsetY || 0), width, height);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(x, y, radius + 7, 0, Math.PI * 2);
  ctx.strokeStyle = "#d7ad58";
  ctx.lineWidth = 10;
  ctx.stroke();
}

function drawInitials(ctx, name, x, y, radius) {
  const initials = (name || "LC").split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#d7ad58";
  ctx.fill();
  ctx.fillStyle = "#10213b";
  ctx.font = "bold 90px Arial";
  ctx.fillText(initials || "LC", x, y + 30);
}
