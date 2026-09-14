// Loads every algorithm file's raw source text at build time, so CodeView
// can render it. Uses Vite's import.meta.glob rather than importing each
// file by name, so a new algorithm added to this folder is automatically
// picked up — same "add a file, nothing else" spirit as the registry in
// index.ts.
const rawModules = import.meta.glob<string>("./*.ts", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Files in this folder that aren't algorithm implementations, so they're
// excluded from the source map below.
const NON_ALGORITHM_FILES = new Set(["./index.ts", "./source.ts"]);

// Maps a registry id (e.g. "bubble") to that algorithm's raw source,
// derived from its filename ("./bubbleSort.ts" -> "bubble") so this
// requires zero manual bookkeeping as algorithms are added.
export const algorithmSource: Record<string, string> = Object.fromEntries(
  Object.entries(rawModules)
    .filter(([path]) => !NON_ALGORITHM_FILES.has(path))
    .map(([path, source]) => {
      const id = path
        .replace("./", "")
        .replace(/Sort\.ts$/, "")
        .toLowerCase();
      return [id, source];
    }),
);
