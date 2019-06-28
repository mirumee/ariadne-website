---
id: extensions
title: Extension system
---

Ariadne implements simple extension system that allows developers to inject custom python logic into the query execution process.

> At the moment extension system is only available for ASGI servers. Subscriptions are not supported.


## Enabling extensions


## Custom extension example

Let's create simple extension that measures query execution time, and appends this time at to query's result.

All extensions should extend special base class named [`Extension`](types-reference.md#extension), importable from `ariadne.types`:

```python
from ariadne.types import Extension


class QueryExecutionTimeExtension(Extension):
    ...
```