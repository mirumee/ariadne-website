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

`GraphQL` takes the same options that [`graphql`](api-reference.md#configuration-options) does, but accepts extra options specific to it:

#### `keepalive`

If given a number of seconds, will send "keepalive" packets to the client in an attempt to prevent the connection from being dropped due to inactivity.

#### `http_handler`

Instance of a class extending `ariadne.asgi.handlers.GraphQLHTTPHandler`. Used to handle HTTP requests.

If not set, `ariadne.asgi.handlers.GraphQLHTTPHandler` is used.

#### `websocket_handler`

Instance of a class extending `ariadne.asgi.handlers.GraphQLWebsocketHandler`. Used to handle WebSocket connections.

If not set, `GraphQLWSHandler` (implementing [`subscriptions-transport-ws`](https://github.com/apollographql/subscriptions-transport-ws) protocol) is used by default.

See [subscriptions](subscriptions#subscription-protocols) documentation for more details.

### `GraphQLHTTPHandler`

```python
GraphQLHTTPHandler(extensions=None, middleware=None)
```

Default handler used by Ariadne's ASGI GraphQL app to handle HTTP requests.

### Optional arguments

#### `extensions`

List of extensions or callable returning those. See [extensions documentation](extensions#enabling-extensions) for more information and examples.

#### `middleware`

List of middlewares or callable returning those. See [middleware documentation](middleware#custom-middleware-example) for more information and examples.
