/** Small, reusable validation helpers for the quiz setup form. */
export function validatePlayerName(value) {
  const name = String(value || "").trim().replace(/\s+/g, " ");
  if (name.length < 2) return { valid: false, message: "Enter your full name (at least 2 characters)." };
  if (name.length > 60) return { valid: false, message: "Your name must be 60 characters or fewer." };
  if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(name)) return { valid: false, message: "Enter a name containing letters." };
  return { valid: true, value: name, message: "" };
}
