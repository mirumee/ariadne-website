---
id: version-0.4.0-starlette-integration
title: Starlette integration
sidebar_label: Starlette
original_id: starlette-integration
---


Ariadne is an ASGI application that can be directly mounted under Starlette. It will support both HTTP and WebSocket traffic used by subscriptions:

```python
from ariadne import QueryType, make_executable_schema
from ariadne.asgi import GraphQL
from starlette.applications import Starlette

type_defs = """
    type Query {
        hello: String!
    }
"""

query = QueryType()


@query.field("hello")
def resolve_hello(*_):
    return "Hello world!"


# Create executable schema instance
schema = make_executable_schema(type_defs, query)

app = Starlette(debug=True)
app.mount("/graphql", GraphQL(schema, debug=True))
```