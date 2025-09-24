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


### Configuration options

`GraphQL` takes the same options that [`graphql`](api-reference.md#configuration-options) does, but accepts extra option specific to it:


#### `keepalive`

If given a number of seconds, will send "keepalive" packets to the client in an attempt to prevent the connection from being dropped due to inactivity.


#### `extensions`

[Extensions](extensions.md) to use during query processing.

Can be list of classes extending [`Extension`](types-reference.md#extension), or callable that will be called with single argument (HTTP request representation specific to the web stack used) that should return `None` or list of those.