---
title: Introducing Ariadne GraphQL Proxy
---

Ariadne GraphQL Proxy is now available!

Ariadne GraphQL Proxy is a Python toolkit for implementing GraphQL APIs that can combine local and remote schemas into single graph.

While this is a 0.1 release, plenty of utilities are already implemented:

- Query router that splits GraphQL queries from clients into a valid subqueries for upstream GraphQL servers.
- Foreign keys and relations between schemas.
- Caching framework for both resolvers and parts of queries.
- Functions for schema manipulation that enable adding, replacing and removing existing GraphQL types, fields and resolvers.

Please note that Ariadne GraphQL Proxy is currently in technology preview stage.

<!--truncate-->

## Getting the code

Ariadne GraphQL Proxy from PyPi:

```
pip install ariadne-graphql-proxy
```

Source code is hosted on [GitHub](https://github.com/mirumee/ariadne-graphql-proxy/tree/main).

## Minimal proxy example

Following code uses Ariadne and Ariadne GraphQL Proxy to create simple pass-through proxy for remote GraphQL API:

```python
from ariadne.asgi import GraphQL
from ariadne_graphql_proxy import ProxySchema, get_context_value

proxy_schema = ProxySchema()
proxy_schema.add_remote_schema("https://example.com/first-graphql/")

final_schema = proxy_schema.get_final_schema()

app = GraphQL(
    final_schema,
    context_value=get_context_value,
    root_value=proxy_schema.root_resolver,
)
```

## Combining schemas

If multiple schemas are added to `ProxySchema`, those are combined with latter fields replacing former's:

```python
from ariadne.asgi import GraphQL
from ariadne_graphql_proxy import ProxySchema, get_context_value

from myapp.schema import local_schema

proxy_schema = ProxySchema()
proxy_schema.add_remote_schema("https://example.com/first-graphql/")
proxy_schema.add_remote_schema("https://example.com/other-graphql/")
proxy_schema.add_schema(local_schema)

final_schema = proxy_schema.get_final_schema()

app = GraphQL(
    final_schema,
    context_value=get_context_value,
    root_value=proxy_schema.root_resolver,
)
```

Ariadne GraphQL Proxy will split root GraphQL query received from clients into separate queries it then will route to other services.

## Caching fields

Ariadne GraphQL Proxy implements two caching strategies for GraphQL resolvers:

- simple strategy where resolver's return value is cached based on its arguments.
- strategy where resolver's return value is cached based on its arguments and queried subfields.

Additional cache schemes based on contents of GraphQL context are also supported.

Basic caching framework with swap-able cache backends is implemented, with example in-memory backend.

See [cache guide](https://github.com/mirumee/ariadne-graphql-proxy/blob/main/GUIDE.md#cache-framework) for more detailed information.

## Relations

Ariadne GraphQL Proxy supports relations spanning multiple schemas. Those relations enable one schema to define mutation returning a type which's definition lives in other schema.

See the [foreign keys guide](https://github.com/mirumee/ariadne-graphql-proxy/blob/main/GUIDE.md#foreign-keys).

## Further reading

No full documentation for Ariadne GraphQL Proxy currently exists, but for available use cases see the [developer guide document](https://github.com/mirumee/ariadne-graphql-proxy/blob/main/GUIDE.md).

## Future plans

This is only a beginning of the Ariadne GraphQL Proxy's story. We've got plenty of new ideas and insights from the experience of building the 0.1 version alone. In coming weeks and months we will experiment with different scenarios and setups to see what improvements and new features can be added to project.

We would also like to invite other Python developers to join us. We welcome feedback, bug reports and feature requests on [our GitHub](https://github.com/mirumee/ariadne-graphql-proxy/issues).
