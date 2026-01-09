import React from "react";
import { createRoot } from "react-dom/client";
import { GraphiQL } from "graphiql";
import { buildSchema } from "graphql";
import "graphiql/style.css";

import schemaString from "./schema.graphql?raw";
import defaultQuery from "./default-query.graphql?raw";

const placeholderToken = "Bearer <TOKEN>";
const defaultHeaders = `{
  // Replace <TOKEN> with your token
  // (https://github.com/settings/tokens).
  "Authorization": "${placeholderToken}"
}
`;

async function fetcher(graphQLParams, options) {
  // Warns if 'Authorization' header isn't set in order to reduce
  // the risk of user confusion as the GraphQL API doesn't accept
  // anonymous requests and may not always provide a helpful response
  // for the user.
  const isAuthorizationHeaderSet = Object.entries(options.headers || {}).some(
    ([key, value]) =>
      key.toLowerCase() === "authorization" &&
      typeof value === "string" &&
      value !== placeholderToken,
  );

  if (!isAuthorizationHeaderSet) {
    return {
      error:
        "Authorization header is missing, learn how in the documentation: " +
        "https://github.com/NyanKiyoshi/graphiql-github-api/blob/main/README.md",
    };
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(graphQLParams),
  });

  return response.json().then((data) => {
    // Logs the query (doesn't contain headers thus no API keys logged)
    // + response, it's useful for debugging and especially for getting
    // JS objects in the console (e.g., running `console.log(output.data.myKey)`
    // on the logged object).
    console.log({
      input: graphQLParams,
      output: data,
    });
    return data;
  });
}

const root = createRoot(document.getElementById("graphiql"));

root.render(
  React.createElement(GraphiQL, {
    fetcher,
    schema: buildSchema(schemaString),
    defaultQuery,
    defaultHeaders,
  }),
);
