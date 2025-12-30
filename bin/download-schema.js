import { writeFileSync } from "node:fs";
import { request } from "undici";
import path from "path";

const outPath = path.join(import.meta.dirname, "../src/schema.graphql");
const { GH_TOKEN } = process.env;

if (!GH_TOKEN) {
  console.error(
    "Missing required environment variable: GH_TOKEN\n" +
      "Hint: generate a fine-grained token at " +
      "https://github.com/settings/personal-access-tokens, or use a GitHub Workflow",
  );
  process.exit(1);
}

const { statusCode, trailers, body } = await request(
  "https://api.github.com/graphql",
  {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v4.idl",
      Authorization: `Bearer ${GH_TOKEN}`,
      // Sets the `fetch()`'s default UA as 'undici' doesn't set any
      // which causes GitHub to block the request (HTTP 403)
      "User-Agent": "node",
    },
  },
);

if (statusCode !== 200) {
  let data;
  try {
    data = await body.text();
  } catch {
    data = "[FAILED TO FETCH BODY]";
  }
  console.error("Failed to fetch schema", { statusCode, body: data });
  process.exit(1);
}

const data = (await body.json()).data;
writeFileSync(outPath, data);
console.log(`OK: wrote to ${outPath} (${data.length} bytes)`);
