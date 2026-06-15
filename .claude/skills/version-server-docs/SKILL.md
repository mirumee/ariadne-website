---
name: version-server-docs
version: 1.0.0
description: |
  Generate a new versioned snapshot of the Ariadne server documentation.
  Fetches tags from the ariadne submodule, checks out the requested tag,
  then runs the Docusaurus versioning command for the server docs plugin.
  Use when you want to snapshot docs for a specific Ariadne release.
allowed-tools:
  - Bash
  - AskUserQuestion
---

# Version Server Docs

Your task is to create a new versioned snapshot of the Ariadne server documentation for the tag provided by the user (or ask for it if not given).

## Steps

1. **Determine the tag** — If the user did not specify a tag, ask them:
   - Run `git -C ariadne fetch --tags` first so the list is up to date.
   - Run `git -C ariadne tag --sort=-version:refname | head -30` to show recent tags.
   - Use `AskUserQuestion` to let them pick or type the desired tag.

2. **Fetch and checkout the tag** in the submodule:
   ```bash
   git -C ariadne fetch --tags
   git -C ariadne checkout <tag>
   ```

3. **Run the Docusaurus versioning command** from the `website/` directory:
   ```bash
   cd website && npm run docusaurus docs:version:server <tag>
   ```

4. **Report the result** — confirm the version was created, mention any new files added (e.g. `website/server_versioned_docs/version-<tag>/`), and remind the user to commit the changes.

## Error handling

- If the tag does not exist, say so clearly and list the 10 most recent tags.
- If `npm run docusaurus docs:version:server` fails, show the full error output and do not proceed.
- Do not modify any files manually — only run the commands above.