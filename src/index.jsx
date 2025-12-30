import { createRoot } from "react-dom/client";
import { GraphiQL } from "graphiql";
import { buildSchema } from "graphql";
import "graphiql/style.css";

import schemaString from "./schema.graphql?raw";

async function fetcher(graphQLParams, options) {
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
const cachedSchemaUrl = new URL("./introspectionSchema.json", import.meta.url)
  .href;

root.render(
  <GraphiQL
    fetcher={fetcher}
    schema={buildSchema(schemaString)}
    defaultQuery={`{
  organization(login: "ghost") {
    repository(name: "my-ghost-repo") {
      pullRequests(first: 10) {
        nodes {
          id
          comments (first: 10) {
            nodes {
              author {login}
              body
            }
          }
        }
      }
    }
  }
}`}
  />,
);
