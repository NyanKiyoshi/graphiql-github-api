# GraphiQL for the GitHub API

<div align="center">
  <img width="700" alt="Cover image" src="https://github.com/user-attachments/assets/de6f37ba-c5f8-4a73-999b-1568f4658681" />
</div>

## Usage

> [!WARNING]
> To use the explorer, you will need to create a token. Go here:
> https://github.com/settings/personal-access-tokens
>
> Then pass the token like so in the "Headers" tab:
>
> ```json
> {
>   "Authorization": "Bearer <MY_TOKEN>"
> }
> ```
>
> Like so: [screenshot](https://github.com/user-attachments/assets/a6452304-d67c-4a36-bb31-9d6c4dddcc5a)
>
> Note: NEVER share the token with anyone, and only assign permissions
> that you need (in most cases, granting only access to Public repositories
> is enough for example.)

### Local Usage

If you just want to run it (without modifying the source code),
then run:

```
$ make build start
```

If you want to edit the source code, then run:

```
$ make build watch
```

## Why

GitHub [killed][GH announcement] their public GraphiQL explorer deployment thus
we now need to run the API calls locally rather than using the convenient explorer.

[GH announcement]: https://github.blog/changelog/2025-08-21-graphql-explorer-removal-from-api-documentation-on-november-1-2025/
