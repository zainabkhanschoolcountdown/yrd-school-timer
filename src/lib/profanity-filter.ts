/**
 * Kid-friendly profanity filter.
 * Checks messages against a list of blocked words and common evasion patterns.
 * Returns cleaned text with bad words replaced by stars, or null if clean.
 */

const BLOCKED_WORDS = [
  "fuck", "shit", "ass", "damn", "hell", "bitch", "bastard", "dick", "cock",
  "pussy", "crap", "piss", "slut", "whore", "cunt", "fag", "retard", "nigger",
  "nigga", "stfu", "wtf", "lmfao", "af", "dumbass", "jackass", "asshole",
  "bullshit", "goddamn", "motherfucker", "fucker", "fucking", "shitty",
  "bitchy", "dammit", "pissed", "crappy", "suck", "sucks", "sucker",
  "douche", "twat", "wanker", "bollocks", "arse", "arsehole", "tosser",
  "bloody", "bugger", "git", "minger", "knob", "bellend", "pillock",
  "plonker",
];

// Build a regex that catches the word even with numbers/symbols substituted
function buildPattern(word: string): RegExp {
  const mapped = word
    .replace(/a/gi, "[a@4]")
    .replace(/e/gi, "[e3]")
    .replace(/i/gi, "[i1!|]")
    .replace(/o/gi, "[o0]")
    .replace(/s/gi, "[s$5]")
    .replace(/t/gi, "[t7]")
    .replace(/l/gi, "[l1|]")
    .replace(/u/gi, "[uv]");
  return new RegExp(`\\b${mapped}\\b`, "gi");
}

const PATTERNS = BLOCKED_WORDS.map(w => buildPattern(w));

export function containsProfanity(text: string): boolean {
  return PATTERNS.some(p => p.test(text));
}

export function censorText(text: string): string {
  let result = text;
  for (const pattern of PATTERNS) {
    result = result.replace(pattern, (match) => "*".repeat(match.length));
  }
  return result;
}