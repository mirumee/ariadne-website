---
title: Standard plugins
---

# Standard plugins

Ariadne Codegen ships with optional plugins importable from the `ariadne_codegen.contrib` package:

- [`ariadne_codegen.contrib.shorter_results.ShorterResultsPlugin`](ariadne_codegen/contrib/shorter_results.py) - This plugin processes generated client methods for operations where only single top field is requested, so they return this field's value directly instead of operation's result type. For example get_user method generated for query `GetUser() { user(...) { ... }}` will return value of user field directly instead of `GetUserResult`.

- [`ariadne_codegen.contrib.extract_operations.ExtractOperationsPlugin`](ariadne_codegen/contrib/extract_operations.py) - This extracts query strings from generated client's methods into separate `operations.py` module. It also modifies the generated client to import these definitions. Generated module name can be customized by adding `operations_module_name="custom_name"` to the `[tool.ariadne-codegen.operations]` section in config. Eg.:

  ```toml
  [tool.ariadne-codegen]
  ...
  plugins = ["ariadne_codegen.contrib.extract_operations.ExtractOperationsPlugin"]

  [tool.ariadne-codegen.extract_operations]
  operations_module_name = "custom_operations_module_name"
  ```

- [`ariadne_codegen.contrib.client_forward_refs.ClientForwardRefsPlugin`](ariadne_codegen/contrib/client_forward_refs.py) - This plugin changes generated client module moving all Pydantic models imports under the `TYPE_CHECKING` condition, making them forward references. This greatly improves the import performance of the `client` module.

- [`ariadne_codegen.contrib.no_reimports.NoReimportsPlugin`](ariadne_codegen/contrib/no_reimports.py) - This plugin removes content of generated `__init__.py`. This is useful in scenarios where generated plugins contain so many Pydantic models that client's eager initialization of entire package on first import is very slow.
