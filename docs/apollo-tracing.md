---
id: apollo-tracing
title: Apollo Tracing
---

[Apollo Tracing](https://blog.apollographql.com/exposing-trace-data-for-your-graphql-server-with-apollo-tracing-97c5dd391385) exposes basic performance data of GraphQL queries: Query execution time and execution time of individual resolvers. Ariadne has GraphQL extension that includes this data in the JSON returned by the server after completing the query.

> **Note:** for performance reasons Apollo Tracing extension excludes default resolvers.


## Enabling Apollo Tracing in the API

To enable Apollo Tracing in your API, import the `ApolloTracingExtension` class from `ariadne.contrib.tracing.apollotracing` and pass it to your server `extensions` option:

```python
from ariadne.contrib.tracing.apollotracing import ApolloTracingExtension

app = GraphQL(
    schema,
    debug=True,
    extensions=[ApolloTracingExtension],
)
```

> **Note:** If you are using WSGI, use `ApolloTracingExtensionSync` in place of `ApolloTracingExtension`.

## Tracing default resolvers for Apollo

By default tracing of default resolvers are set to False but if you want to trace base field types for which resolvers are not explicitly set then it can be done by setting the parameter `trace_default_resolver` to `True`. This is useful when used in conjunction with Apollo Studio to see which base fields are being accessed for a entity and thereby helping api lifecycle management.

```python
from ariadne.contrib.tracing.apollotracing import ApolloTracingExtension

app = GraphQL(
    schema,
    debug=True,
    extensions=[ApolloTracingExtension(trace_default_resolver=True)],
)
```