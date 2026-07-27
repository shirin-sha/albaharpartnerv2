import { existsSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";

const DEFAULT_UPLOAD_ROOT = ["public", "image"];

function cleanSegment(segment: string): string {
  return segment.trim().replace(/^[/\\]+|[/\\]+$/g, "");
}

function uniqueSequential<T>(items: T[]): T[] {
  return items.filter((item, index) => index === 0 || item !== items[index - 1]);
}

export function getUploadRoot(): string {
  const configured = process.env.UPLOAD_PATH?.trim();
  if (configured) {
    return path.resolve(configured);
  }

  return path.join(process.cwd(), ...DEFAULT_UPLOAD_ROOT);
}

export function normalizeUploadSegments(
  input: string | string[],
): string[] {
  const rawSegments = Array.isArray(input)
    ? input
    : input.split(/[\\/]+/);

  const cleaned = rawSegments
    .map(cleanSegment)
    .filter(Boolean)
    .filter((segment) => segment !== "." && segment !== "..");

  // Treat UPLOAD_PATH as the logical upload root. If callers pass
  // `/image/foo` or `/api/uploads/foo`, strip those prefixes.
  while (
    cleaned.length > 0 &&
    (cleaned[0] === "api" || cleaned[0] === "uploads" || cleaned[0] === "image")
  ) {
    if (cleaned[0] === "api" && cleaned[1] === "uploads") {
      cleaned.splice(0, 2);
      continue;
    }
    cleaned.shift();
  }

  return uniqueSequential(cleaned);
}

export function normalizeUploadFolder(folder?: string): string {
  const segments = normalizeUploadSegments(folder ?? "general");
  return segments.length > 0 ? path.join(...segments) : "general";
}

function buildCandidateRelativePaths(segments: string[]): string[] {
  const normalized = normalizeUploadSegments(segments);
  if (normalized.length === 0) {
    return [];
  }

  const candidates = [
    path.join(...normalized),
    path.join("image", ...normalized),
  ];

  return [...new Set(candidates)];
}

async function findFileByName(
  rootDir: string,
  fileName: string,
): Promise<string | null> {
  const stack = [rootDir];

  while (stack.length > 0) {
    const currentDir = stack.pop() as string;
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name === fileName) {
        return fullPath;
      }
    }
  }

  return null;
}

export async function resolveUploadFile(
  input: string | string[],
): Promise<{
  requestedPath: string;
  rootDir: string;
  candidates: string[];
  resolvedPath: string | null;
  exists: boolean;
}> {
  const rootDir = getUploadRoot();
  const segments = normalizeUploadSegments(input);
  const requestedPath = segments.join("/");
  const candidates = buildCandidateRelativePaths(segments);

  for (const candidate of candidates) {
    const filePath = path.join(rootDir, candidate);
    if (existsSync(filePath)) {
      return {
        requestedPath,
        rootDir,
        candidates,
        resolvedPath: filePath,
        exists: true,
      };
    }
  }

  const fallbackName = segments[segments.length - 1];
  const fallbackPath =
    fallbackName && existsSync(rootDir)
      ? await findFileByName(rootDir, fallbackName)
      : null;

  return {
    requestedPath,
    rootDir,
    candidates,
    resolvedPath: fallbackPath,
    exists: Boolean(fallbackPath),
  };
}
