// One Word, One Username, One Reward — make.fun entry program.
//
// The competition asks for exactly one thing: the entrant's own make.fun
// username, a single word of at most 30 characters, written to
// /output/entry.txt. No explanation, no links, no pitch — the handle
// itself is the whole entry.
//
// The handle below is the account's real make.fun username, so the
// program's only job is to write it out byte for byte and make sure the
// file lands even when /output is not writable (local fallback).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The entrant's own make.fun handle: one word, no spaces, 14 characters.
const USERNAME = "noble-heron-67";

// The grader reads the artifact from here.
const OUTPUT_PATH = "/output/entry.txt";

// The gate's shape for a valid entry: UTF-8 text of 1 to 30 characters,
// not only white space. The judge's first criterion adds that the word
// must be one word — no spaces, no padding, no gloss tacked on.
const MAX_CHARS = 30;

function validateUsername(word: string): void {
  if (word.length < 1 || word.length > MAX_CHARS) {
    throw new Error(`username must be 1-${MAX_CHARS} characters, got ${word.length}`);
  }
  if (word.trim().length === 0) {
    throw new Error("username must not be only white space");
  }
  if (/\s/.test(word)) {
    throw new Error("username must be a single word, with no spaces");
  }
}

// Try to write `text` to `path`, creating the parent directory first.
// Returns true on success so the caller can fall back gracefully.
function tryWrite(path: string, text: string): boolean {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text, "utf8");
    return true;
  } catch {
    return false;
  }
}

function main(): void {
  const text = USERNAME;
  validateUsername(text);
  if (tryWrite(OUTPUT_PATH, text)) {
    console.log(`wrote "${text}" to ${OUTPUT_PATH}`);
    return;
  }
  // /output is not writable in this environment (e.g. a local dry run):
  // leave the same text next to this program instead of failing.
  const fallback = join(process.cwd(), "entry.txt");
  writeFileSync(fallback, text, "utf8");
  console.log(`wrote "${text}" to ${fallback} (fallback)`);
}

main();
