---
id: logging
title: Logging
---


Ariadne logs all errors using default the `ariadne` logger. To define a custom logger instead, pass its name (or a Logger/LoggerAdapter instance) to the `logger` argument when instantiating your application:

```python
from ariadne.wsgi import GraphQL
from .schema import schema

app = GraphQL(schema, logger="admin.graphql")
```

```python
import logging
from ariadne.wsgi import GraphQL
from .schema import schema

logger = logging.getLogger("admin.graphql")

app = GraphQL(schema, logger=logger)
```

The `logger` argument is supported by following functions and objects:

- `ariadne.graphql`
- `ariadne.graphql_sync`
- `ariadne.subscription`
- `ariadne.asgi.GraphQL`
- `ariadne.wsgi.GraphQL`
