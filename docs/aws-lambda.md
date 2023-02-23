---
id: aws-lambda
title: AWS lambda
---

Multiple ways to implement an AWS Lambda function for GraphQL using Ariadne exist.

This document presents selected few of those, but it's aim is not to be an __exhaustive__ list of all approaches to using Ariadne on the AWS Lambda.


## Deploying ASGI application with Mangum

Mangum is an adapter that can be used to run Ariadne [ASGI](asgi.md) application on AWS Lambda:

```python
from ariadne import make_executable_schema, gql
from ariadne.asgi import GraphQL
from mangum import Mangum

type_defs = gql(
    """
    type Query {
        hello: String!
    }
    """
)

schema = make_executable_schema(type_defs)

app = GraphQL(schema, root_value={"hello": "Hello world!"})

handler = Mangum(app, lifespan="off")
```

This approach is recommended because it gives immediate availability of Ariadne's features through the `GraphQL` object's options, and doesn't require implementation of custom translation layer between GraphQL engine and AWS lambda.


## Minimal lambda handler example

If you want to skip the HTTP stack altogether you can execute the queries directly using the [`graphql_sync`](api-reference.md#graphql_sync):

```python
import json
import logging

from ariadne import QueryType, graphql_sync, make_executable_schema, gql

logger = logging.getLogger()

type_defs = gql(
    """
    type Query {
        hello: String!
    }
    """
)

query_type = QueryType()

@query_type.field("hello")
def resolve_hello(_, info):
    http_context = info.context["requestContext"]["http"]
    user_agent = http_context.get("userAgent") or "Anon"
    return f"Hello {user_agent}!"


schema = make_executable_schema(type_defs, query_type)

def handler(event: dict, _):
    try:
        data = json.loads(event.get("body") or "")
    except ValueError as exc:
        return response({"error": f"Failed to parse JSON: {exc}"}, 405)

    success, result = graphql_sync(
        schema,
        data,
        context_value=event,
        logger=logger,
    )

    return response(result, 200 if success else 400)


def response(body: dict, status_code: int = 200):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body),
    }
```

This lambda function will expect a JSON request with at least one key, a `query` with a `str` containing the GraphQL query.

> **Note:** Mangum doesn't require Ariadne's ASGI application exactly. If you need your lambda function to offer other API endpoints in addition to the GraphQL, you can combine your Ariadne's app with [Starlette](starlette-integration.md) or [FastAPI](fastapi-integration.md).


### Asynchronous example

In case where you want to run your handler asynchronously, you'll need to run it in an event loop.

This can be done manually or by decorating the async handler with the `async_to_sync` decorator from the `asgiref` package:

```python
import json
import logging

from ariadne import QueryType, graphql, make_executable_schema, gql
from asgiref.sync import async_to_sync

logger = logging.getLogger()

type_defs = gql(
    """
    type Query {
        hello: String!
    }
    """
)

query_type = QueryType()

@query_type.field("hello")
def resolve_hello(_, info):
    http_context = info.context["requestContext"]["http"]
    user_agent = http_context.get("userAgent") or "Anon"
    return f"Hello {user_agent}!"


schema = make_executable_schema(type_defs, query_type)

@async_to_sync
async def handler(event: dict, _):
    try:
        data = json.loads(event.get("body") or "")
    except ValueError as exc:
        return response({"error": f"Failed to parse JSON: {exc}"}, 405)

    success, result = await graphql(
        schema,
        data,
        context_value=event,
        logger=logger,
    )

    return response(result, 200 if success else 400)


def response(body: dict, status_code: int = 200):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body),
    }
```