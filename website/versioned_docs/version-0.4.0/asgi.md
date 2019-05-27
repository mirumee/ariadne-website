---
id: version-0.4.0-asgi
title: ASGI application
original_id: asgi
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

`GraphQL` takes mostly the same options that [`graphql`](api-reference.md#configuration-options) does, but with two differences:

- `context_value` can be callable that will be called with single argument ([`Request`](https://www.starlette.io/requests/#request) instance) and its return value will be used for rest of query execution as `context_value`.
- `keepalive`, if given a number of seconds, will send "keepalive" packets to the client in an attempt to prevent the connection from being dropped due to inactivity.
