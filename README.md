# ariadnegraphql.org

The code that powers [Ariadne](https://github.com/mirumee/ariadne) website, made with [🦖 Docusaurus](https://docusaurus.io).

## Working with Git Submodules

This repository uses Git submodules to include documentation from the `ariadne` and `ariadne-codegen` repositories. The submodules are essential for the website to build and function correctly.

### Initial Setup

When cloning this repository for the first time, you need to initialize and update the submodules:

```bash
# Clone the repository with submodules
git clone --recurse-submodules https://github.com/mirumee/ariadne-website.git

# Or if you've already cloned without submodules, initialize them:
git submodule update --init --recursive
```

This will:

- Initialize the `ariadne` submodule (server documentation)
- Initialize the `ariadne-codegen` submodule (client documentation)

### Updating Submodules to Specific Tags

The submodules should be kept synchronized with specific GitHub tags/versions. To update a submodule to a specific tag:

```bash
# Navigate to the submodule directory
cd ariadne  # or cd ariadne-codegen

# Fetch the latest tags
git fetch --tags

# Checkout the desired tag
git checkout <tag-name>

# Return to the root directory
cd ..

# Commit the submodule update
git add ariadne  # or ariadne-codegen
git commit -m "Update ariadne submodule to <tag-name>"
```

### Updating All Submodules

To update all submodules to their latest commits from their respective remotes:

```bash
git submodule update --remote --merge
```

### Checking Submodule Status

To see which commit each submodule is currently pointing to:

```bash
git submodule status
```

## Generate new version

For server documentation run:

```bash
npm run docusaurus docs:version:server x.x.x
```

For client documentation run:

```bash
npm run docusaurus docs:version:client x.x.x
```

Where x.x.x is your new version number.

## Publishing docs

Before publishing make sure that `GIT_USER` env variable is set and contains your GitHub username and `USE_SSH` is set to `true`!

1. Make sure you are on `main` branch
2. `cd` to `website` directory
3. run `npm run deploy`

## Search index

We are using [algolia docsearch](https://docsearch.algolia.com/) for the search. Site is indexed automatically one in three days. To trigger it manually go to the [crawler dashboard](https://crawler.algolia.com/). We are using [default crawler](https://docsearch.algolia.com/docs/templates/#default-template).

## Contributing

We are welcoming contributions! If you've found an issue or have any ideas or feedback, feel free to use [GitHub issues](https://github.com/mirumee/ariadne-website/issues) to chime in.

For guidance and instructions, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Contents of this repository are licensed under the BSD three clause license.

**Crafted with ❤️ by [Mirumee Software](http://mirumee.com)**
<ariadne@mirumee.com>
