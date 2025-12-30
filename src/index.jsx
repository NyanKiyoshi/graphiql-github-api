import { createRoot } from "react-dom/client";
import { GraphiQL } from "graphiql";
import { buildSchema } from "graphql";
import "graphiql/style.css";

import schemaString from "./schema.graphql?raw";

async function fetcher(graphQLParams, options) {
  // Warns if 'Authorization' header isn't set in order to reduce
  // the risk of user confusion as the GraphQL API doesn't accept
  // anonymous requests and may not always provide a helpful response
  // for the user.
  const isAuthorizationHeaderSet = Object.keys(options.headers || {}).some(
    (key) => key.toLowerCase() === "authorization",
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
const cachedSchemaUrl = new URL("./introspectionSchema.json", import.meta.url)
  .href;

root.render(
  <GraphiQL
    fetcher={fetcher}
    schema={buildSchema(schemaString)}
    defaultQuery={`
# !!!! WARNING !!!
# For it to work, you need to setup a GitHub Token and add it in the headers:
# {
#    "Authorization": "Bearer <TOKEN>"
# }
# 
# But replace <TOKEN> with your token (https://github.com/settings/tokens).
#
# Remember: NEVER share the token with anyone, and grant as little permissions
#           as possible.
#
{
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
