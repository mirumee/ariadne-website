---
id: subscriptions
title: Subscriptions
---


Let's introduce a third type of operation. While queries offer a way to query a server once, subscriptions offer a way for the server to notify the client each time new data is available.

This is where the `Subscription` type is useful. It's similar to `Query` but as each subscription remains an open channel you can send anywhere from zero to millions of responses over its lifetime.

> Because of their nature, subscriptions are only possible to implement in asynchronous servers that implement the WebSockets protocol.
>
> *WSGI*-based servers (including Django) are synchronous in nature and *unable* to handle WebSockets which makes them incapable of implementing subscriptions.
>
> If you wish to use subscriptions with Django, consider wrapping your Django application in a Django Channels container and using Ariadne as an *ASGI* server.


## Defining subscriptions

In schema definitions subscriptions look similar to queries:

```graphql
type Query {
    _unused: Boolean
}

type Subscription {
    counter: Int!
}
```

This example contains:

- `Query` type with single unused field. GraphQL considers an empty type a syntax error and requires an API to always define a `Query` type.
    - For this example, we're focusing on `Subscription`s so we define a bare bones `Query` type.
- `Subscription` type with a single field, `counter`, that returns a number.

When defining subscriptions you can use all of the features of the schema such as arguments, input and output types.


## Writing subscriptions

Subscriptions are more complex than queries as they require us to provide two functions for each field:

- `generator` is a function that yields data we're going to send to the client. It has to implement the `AsyncGenerator` protocol.
- `resolver` that tells the server how to send data to the client. This is similar to the [resolvers we wrote earlier](resolvers.md).

> Make sure you understand how asynchronous generators work before attempting to use subscriptions.

The signatures are as follows:

```python
async def counter_generator(obj, info):
    for i in range(5):
        await asyncio.sleep(1)
        yield i

def counter_resolver(count, info):
    return count + 1
```

Note that the resolver consumes the same type (in this case `int`) that the generator yields.

Each time our source yields a response, it's getting sent to our resolver. The above implementation counts from zero to four, each time waiting for one second before yielding a value.

The resolver increases each number by one before passing them to the client so the client sees the counter progress from one to five.

After the last value is yielded the generator returns, the server tells the client that no more data will be available, and the subscription is complete.

We can map these functions to subscription fields using the `SubscriptionType` class that extends `ObjectType` with support for `source`:

```python
from ariadne import SubscriptionType
from . import counter_subscriptions

subscription = SubscriptionType()
subscription.set_field("counter", counter_subscriptions.counter_resolver)
subscription.set_source("counter", counter_subscriptions.counter_generator)
```

You can also use the `source` decorator:

```python
@subscription.source("counter")
async def counter_generator(
    obj: Any, info: GraphQLResolveInfo
) -> AsyncGenerator[int, None]:
    ...
```


## Complete example

For reference here is a complete example of the GraphQL API that supports a subscription:

```python
import asyncio
from ariadne import SubscriptionType, make_executable_schema
from ariadne.asgi import GraphQL

type_def = """
    type Query {
        _unused: Boolean
    }

    type Subscription {
        counter: Int!
    }
"""

subscription = SubscriptionType()

@subscription.source("counter")
async def counter_generator(obj, info):
    for i in range(5):
        await asyncio.sleep(1)
        yield i


@subscription.field("counter")
def counter_resolver(count, info):
    return count + 1


schema = make_executable_schema(type_def, subscription)
app = GraphQL(schema, debug=True)
```
