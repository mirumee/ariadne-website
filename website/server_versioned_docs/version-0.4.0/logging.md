---
id: version-0.4.0-logging
title: Logging
original_id: logging
---


Ariadne logs all errors using default `ariadne` logger. To define custom logger instead, pass its name to `logger` option:

```python
from ariadne.wsgi import GraphQL
from .schema import schema

app = GraphQL(schema, logger="admin.graphql")
```

`logger` option is supported by following functions and objects:

- `ariadne.graphql`
- `ariadne.graphql_sync`
- `ariadne.subscription`
- `ariadne.asgi.GraphQL`
- `ariadne.wsgi.GraphQL`
