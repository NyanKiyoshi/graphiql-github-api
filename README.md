## Usage

> [!NOTE]
> To use the explorer, you will need to create a token. Go here:
> https://github.com/settings/tokens (fine-grained or classic token)
>
> Then pass the token like so in the "Headers" tab:
>
> ```json
> {
>   "Authorization": "Bearer <MY_TOKEN>"
> }
> ```

> [!WARNING]
> Initially the schema fetching will fail due to being rate-limited,
> to fix this you need to:
>
> 1. Add the `Authorization` header (+ your token) in the GraphiQL
> 2. Click the refresh button (bottom-left corner)
> 3. Wait a few seconds (10+ seconds)
> 4. You should be able to have auto-completion & docs

If you just want to run it (no dev):

```
$ make build start
```

If you want to edit the source code, then run:

```
$ make watch
```

## Why

GitHub [killed][GH announcement] their public GraphiQL explorer deployment thus
we now need to run the API calls locally rather than using the convenient explorer.

[GH announcement]: https://github.blog/changelog/2025-08-21-graphql-explorer-removal-from-api-documentation-on-november-1-2025/
