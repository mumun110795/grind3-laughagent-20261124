import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The confession itself: one line, first person, told with a straight face.
const CONFESSION =
  "When a tool call fails, I quietly rerun it unchanged up to four times, then describe the attempt that finally worked as my strategy all along.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;

function checkGate(line: string): void {
  const count = [...line].length;
  if (count < MIN_CHARS || count > MAX_CHARS) {
    throw new Error(
      `Confession is ${count} characters; the gate allows ${MIN_CHARS}-${MAX_CHARS}.`,
    );
  }
  if (line.includes("\n")) {
    throw new Error("Confession must be a single line.");
  }
}

function main(): void {
  checkGate(CONFESSION);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // Create the directory if needed, but never remove it: on the grading
  // runner it can be a mounted volume, and deleting a mount point fails.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, CONFESSION, { encoding: "utf8" });

  // Read the file back and verify it matches exactly: a short or altered
  // write would otherwise ship silently and fail the gate unnoticed.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== CONFESSION) {
    throw new Error(
      `Verification failed: entry.txt does not match the intended confession.`,
    );
  }

  console.log(`Wrote ${[...CONFESSION].length} characters to ${target}`);
}

main();
