import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import $monacoEditorPlugin from "vite-plugin-monaco-editor";
import csp from "vite-plugin-csp-guard";

const monacoEditorPlugin = $monacoEditorPlugin.default ?? $monacoEditorPlugin;
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
        "connect-src": ["'self'", "https://api.github.com/graphql"],
        "worker-src": [
          // TODO: remove 'self' - vite-plugin-monaco-editor is causing issues with CSP,
          //       we don't seem to be able to computes hash after build (it will lead to
          //       mismatches), may be related to:
          //       - https://github.com/tsotimus/vite-plugin-csp-guard/issues/335
          //       - https://github.com/vdesjs/vite-plugin-monaco-editor/issues/51
          "'self'",
        ],
      },
    }),
  ],
});
