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

To use this middleware in your queries, pass it to the `middleware` option of the HTTP handler:

```python
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLHTTPHandler


def lowercase_middleware(resolver, obj, info, **args):
    value = resolver(obj, info, **args)
    if isinstance(value, str):
        return value.lower()
    return value


app = GrapqhQL(
    schema,
    http_handler=GraphQLHTTPHandler(
        middleware=[lowercase_middleware],
    ),
)
```

In case when more than one middleware is enabled on the server, the `resolver` argument will point to the partial function constructed from the next middleware in the execution chain.


## Middleware managers

Middleware are ran through special class implemented by GraphQL named `MiddlewareManager`. If you want to replace this manager with custom one, you provide your own implementation using the `middleware_manager_class` option:

```python
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLHTTPHandler
from graphql import GraphQLFieldResolver, MiddlewareManager


def lowercase_middleware(resolver, obj, info, **args):
    value = resolver(obj, info, **args)
    if isinstance(value, str):
        return value.lower()
    return value


class CustomMiddlewareManager(MiddlewareManager):
    def get_field_resolver(
        self, field_resolver: GraphQLFieldResolver
    ) -> GraphQLFieldResolver:
        """Wrap the provided resolver with the middleware.
        Returns a function that chains the middleware functions with the provided
        resolver function.
        """
        if self._middleware_resolvers is None:
            return field_resolver
        if field_resolver not in self._cached_resolvers:
            self._cached_resolvers[field_resolver] = reduce(
                lambda chained_fns, next_fn: partial(next_fn, chained_fns),
                self._middleware_resolvers,
                field_resolver,
            )
        return self._cached_resolvers[field_resolver]


app = GrapqhQL(
    schema,
    http_handler=GraphQLHTTPHandler(
        middleware=[lowercase_middleware],
        middleware_manager_class=CustomMiddlewareManager,
    ),
)
```


## Middleware and extensions

Extensions [`resolve`](types-reference.md#resolve) hook is actually a middleware. In case when GraphQL server is configured to use both middleware and extensions, extensions `resolve` hooks will be executed before the `middleware` functions.


## Performance impact

Middlewares are called for **EVERY** resolver call.

Considering this query:

```graphql
{
    users {
        id
        email
        username
    }
}
```

If `users` resolver returns 100 users, middleware function will be called 301 times:

- one time for `Query.users` resolver
- 100 times for `id`
- 100 times for `email`
- 100 times for username

Avoid implementing costful or slow logic in middlewares. Use python decorators applied explicitly to resolver functions or ASGI/WSGI middlewares combined with callable `context_value`.
