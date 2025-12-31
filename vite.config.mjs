import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import $monacoEditorPlugin from "vite-plugin-monaco-editor";
import { createHash } from "crypto";
import csp from "vite-plugin-csp-guard";
import fs from "fs";
import path from "path";

const monacoEditorPlugin = $monacoEditorPlugin.default ?? $monacoEditorPlugin;

/**
 * @param {String} data The data to hash (string)
 */
export const generateCSPHashForFile = (file) => {
  const data = fs.readFileSync(file, "utf8");
  const hash = createHash("sha512").update(data).digest("base64");
  return `'sha512-${hash}'`;
};

/**
 * @param {String} dirPath The path to the directory containing the files to hash
 * @returns {Object} A mapping of file paths to their corresponding hashes
 */
const generateCSPHashesForDirectory = (dirPath) => {
  const hashes = [];

  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);

    // Only hash files (skip directories)
    if (fs.lstatSync(filePath).isFile()) {
      console.debug("hasibng", filePath);
      const hash = generateCSPHashForFile(filePath);
      hashes.push(hash);
    }
  });

  return hashes;
};

const monacoWorkerJSFilePath = "monaco-graphql/esm/graphql.worker.js";

export default defineConfig({
  base: "",
  plugins: [
    monacoEditorPlugin({
      languageWorkers: ["editorWorkerService", "json"],
      customWorkers: [
        {
          label: "graphql",
          entry: monacoWorkerJSFilePath,
        },
      ],
    }),
    react(),
    // Automatically creates the CSP using the hashes from the bundle
    csp({
      algorithm: "sha512",
      dev: {
        run: true, // Don't disable the plugin during development
      },
      policy: {
        // Specify the policy here.
        "script-src": ["'unsafe-inline'"],
        "style-src-elem": ["'unsafe-inline'"],
        "style-src-attr": ["'unsafe-inline'"],
        "font-src": ["'self'", "data:"],
        "worker-src": [
          // TODO: remove 'self' - vite-plugin-monaco-editor is causing issues with CSP,
          //       we don't seem to be able to computes hash after build (it will lead to
          //       mismatches), may be related to:
          //       - https://github.com/tsotimus/vite-plugin-csp-guard/issues/335
          //       - https://github.com/vdesjs/vite-plugin-monaco-editor/issues/51
          "'self'",
          // TODO: this should work but it doesn't (c.f., above TODO)
          ...generateCSPHashesForDirectory(
            path.join(import.meta.dirname, "dist/monacoeditorwork/"),
          ),
        ],
      },
    }),
  ],
});
