---
id: extensions
title: Extension system
---

Ariadne implements simple extension system that allows developers to inject custom python logic into the query execution process.

> At the moment extension system is only available for ASGI servers. Subscriptions are not supported.


## Enabling extensions

To enable extensions, initialize `GraphQL` app with `extensions` parameter. This parameter accepts list of [extensions](types-reference.md#extension):

```python
from ariadne.asgi import GraphQL

from .schema import schema
from .extensions import MyExtension


app = GraphQL(
    schema,
    extensions=[MyExtension]
)
```

Alternatively, if your extension depends on request or should be enabled conditionally, you can provide callable that will return extensions that should be used:

```python
from ariadne.asgi import GraphQL

from .schema import schema
from .extensions import MyExtension


def get_extensions(request):
    if request.headers.get("x-enable-my-extension"):
        return [MyExtension]
    return None


app = GraphQL(
    schema,
    extensions=get_extensions
)
```


## Custom extension example

Let's create simple extension that measures query execution time, and appends this time at to query's result.

All extensions should extend special base class named [`Extension`](types-reference.md#extension), importable from `ariadne.types`:

```python
from ariadne.types import Extension


class QueryExecutionTimeExtension(Extension):
    ...
```