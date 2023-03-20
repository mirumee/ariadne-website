---
title: Ariadne Codegen 0.4
---

Ariadne Codegen 0.4 is now available!

This release deprecates `[ariadne-codegen]` as configuration section used by the library.  New section used is `[tool.ariadne-codegen]` which follows PEP 518. While old name will still be support for a while, you are recommended to update your `pyproject.toml` to use new section name.

New in this release is also a plugin system, enabling better customization of generated Python AST for developers who need it. See the [plugins guide](https://github.com/mirumee/ariadne-codegen/blob/main/PLUGINS.md) for examples and reference.

Finally, `ariadne-codegen` now accepts `--config` option, enabling usage of custom named configuration files and usage of multiple separate configuration files for generating clients for APIs within single project.


## Changelog

- Fixed generating models from interfaces with inline fragments.
- Added default `None` values for generated methods optional arguments.
- Added basic plugin system.
- Added `InitFileGenerator`, `EnumsGenerator`, `ClientGenerator` and `ArgumentsGenerator` plugin hooks.
- Added `InputTypesGenerator` and `ResultTypesGenerator` plugin hooks.
- Added `ScalarsDefinitionsGenerator` and `PackageGenerator` plugin hooks.
- Added support for `[tool.ariadne-codegen]` section key. Deprecated `[ariadne-codegen]`.
- Added support for environment variables to remote schema headers values.
- Added `--config` argument to `ariadne-codegen` script, to support reading configuration from custom path.