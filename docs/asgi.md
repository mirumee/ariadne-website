---
id: asgi
title: ASGI application
---

Ariadne provides a `GraphQL` class that implements a production-ready ASGI application.


## Using with an ASGI server

First create an application instance pointing it to the schema to serve:

```python
# in myasgi.py
import os

from ariadne import make_executable_schema
from ariadne.asgi import GraphQL
from mygraphql import type_defs, resolvers

schema = make_executable_schema(type_defs, resolvers)
application = GraphQL(schema)
```

Then point an ASGI server such as uvicorn at the above instance.

Example using uvicorn:

```console
$ uvicorn myasgi:application
```


## Configuration options

See the [reference](asgi-reference.md#constructor).
