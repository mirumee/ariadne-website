---
id: middleware
title: Middleware
---

GraphQL middleware are Python functions and callable objects that can be used to inject custom logic into query executor.

Middlewares share most of their arguments with [`resolvers`](types-reference.md#resolver), but take one extra argument: `resolver` callable that is resolver associated with currently resolved field:

```python
def lowercase_middleware(resolver, obj, info, **args)
```

> **Note**
>
> GraphQL middleware is sometimes confused with the ASGI or WSGI middleware, but its not the same thing!

> **Note**
>
> Middleware is not supported by subscriptions.


## Custom middleware example

Code below implements custom middleware that converts any strings returned by resolvers to lower case:

```python
def lowercase_middleware(resolver, obj, info, **args):
    value = resolver(obj, info, **args)
    if isinstance(value, str):
        return value.lower()
    return value
```

To use this middleware in your queries, simply pass it to `middleware` option:

```python
from ariadne.asgi import GraphQL


app = GrapqhQL(schema, middleware=[lowercase_middleware])
```

In case when more than one middleware is enabled on the server, the `resolver` argument will point to the partial function constructed from the next middleware in the execution chain.


## Middleware and extensions

Extensions [`resolve`](types-reference.md#resolve) hook is actually a middleware. In case when GraphQL server is configured to use both middleware and extensions, extensions `resolve` hook will be executed before the `middleware` functions.
