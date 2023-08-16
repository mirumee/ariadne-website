---
id: query-validation-caching
title: Query validation caching
---

In case you are serving complex queries, or a lot of identical queries, it might make sense for you to cache the query parsing and validation.

This can be done by setting a custom `query_parser` and `query_validator` on your `GraphQL` server instance:

```python
from collections.abc import Collection
from functools import lru_cache
from typing import Any

from ariadne import make_executable_schema
from ariadne.asgi import GraphQL
from ariadne.graphql import validate_query
from ariadne.types import ContextValue
from graphql import ASTValidationRule, DocumentNode, GraphQLError, GraphQLSchema, TypeInfo, parse

# Cached versions of the default parser and validator
cached_parser = lru_cache(maxsize=64)(parse)
cached_validator = lru_cache(maxsize=64)(validate_query)


def query_validator(
    schema: GraphQLSchema,
    document_ast: DocumentNode,
    rules: Collection[type[ASTValidationRule]] | None = None,
    max_errors: int | None = None,
    type_info: TypeInfo | None = None,
) -> list[GraphQLError]:
    return cached_validator(schema=schema, document_ast=document_ast)


def query_parser(context: ContextValue, query: dict[str, Any]) -> DocumentNode:
    return cached_parser(query["query"])


# Add type definitions, resolvers, etc...
schema = make_executable_schema()

# Using our custom functions for parsing & validation
graphql = GraphQL(schema, query_parser=query_parser, query_validator=query_validator)
```
