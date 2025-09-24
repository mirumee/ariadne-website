---
title: Ariadne GraphQL Modules 0.7.0
---

[Ariadne GraphQL Modules](https://github.com/mirumee/ariadne-graphql-modules) 0.7 has been released. This release adds support for Ariadne's approach to defining a schema to `make_executable_schema`, enabling developers to incrementally switch their schema definition to modular approach (or vice versa).

<!--truncate-->

## `make_executable_schema` accepts SDL strings and schema bindables

`make_executable_schema` importable from `ariadne_graphql_modules` is now almost a drop-in replacement for it's `ariadne` counterpart:

```python
from ariadne import make_executable_schema

schema = make_executable_schema(type_defs, query_type, user_type)
```

New code:

```python
from ariadne_graphql_modules import make_executable_schema

schema = make_executable_schema(type_defs, query_type, user_type)
```

### Explicit unpacking

`ariadne` version supports passing lists of bindables and type_defs (strings with SDL). For `ariadne_graphql_modules` you need to explicitly unpack those by prefixing their names with `*`:

```python
from ariadne_graphql_modules import make_executable_schema

schema = make_executable_schema(type_defs, query_type, *user_types)
```

### Directives

`directives` option is named `extra_directives` in `ariadne_graphql_modules` version of `make_executable_schema`:

```python
from ariadne_graphql_modules import make_executable_schema

schema = make_executable_schema(
    type_defs, type_a, type_b, type_c,
    extra_directives={"date": MyDateDirective},
)
```

## Changelog

- Added support for Ariadne schema definitions to `make_executable_schema`.
