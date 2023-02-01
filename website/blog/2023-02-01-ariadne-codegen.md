---
title: Announcing Ariadne Codegen !
---

![Ariadne Codegen!](assets/ariadne-codegen.jpg)

Today we are announcing first release of [Ariadne Codegen](https://github.com/mirumee/ariadne-codegen)! 

Ariadne Codegen is our solution for the problem of writing and maintaining a Python boilerplate code for GraphQL clients.


<!--truncate-->


## The story

Ariadne Codegen was created from our need for better solution for GraphQL Clients. At [Mirumee Software](https://mirumee.com) we are writing a lot of Python services that integrate with or extend [Saleor](https://graphql.com/saleor/saleor), our GraphQL-first e-commerce software.

This means we are writing a lot of GraphQL clients, and a lot of those clients follow same structure:

- There's a module that evolves into a package named `saleor_client`.
- This client implements functions like `get_shipping_methods` or `create_checkout` that map 1:1 to GraphQL queries and mutations implemented by Saleor.
- Each of those functions takes arguments it packages into a variables dictionary, combines them with Python string containing a GraphQL query.
- Each of those functions then does a `POST` request, handles errors and returns result.

Basically, we wrote functions upon a functions upon a functions that look like this:

```python
async def create_checkout(client, email: str,  lines: dict, address: Address):
    address_json = address.json()

    variables = {
        "channel": "USD",
        "email" email,
        "lines": [
            {"variantId": variant, "quantity": quantity}
            for variant, quantity in lines.items()
        ],
        "shippingAddress": address,
        "billingAddress": address,
    }

    query = """
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
            checkout {
                id
            }
            errors {
                field
                message
                code
                variants
                lines
                addressType
            }
        }
    }
    """

    result = await client.post(
        GRAPHQL_URL,
        json={
            "query": query,
            "operationName": "CheckoutCreate",
            "variables": {"input": variables}
        }
    )

    # Repackages HTTP errors from httpx into errors like
    # `SaleorAuthenticationError`
    raise_saleor_error(result)

    data = await result.json()

    if data.get("errors"):
        # Repackage GraphQL errors
        raise_graphql_error(data["errors"])
    
    return data["checkoutCreate"]["checkout"]["id"]
```

There's actually a very little variety in logic of those functions, and many of them are created by copying an already existing function and changing the variables and query string. For functions that return an objects, we would also maintain Pydantic models so we have result data packaged as types with code suggestions and MyPy checks instead of dicts and lists.


### Automatization

Very quickly we've started to experiment with different approaches to automatizing this away:

- Code generator which was aware of GraphQL schema and converted GraphQL operations into a Python package.
- An WSDL-like client for GraphQL which also was aware of GraphQL schema and did it's logic on the fly.

First approach had a downside of requiring package to be regenerated on every new or changed query, but it had three advantages:

- It didn't have extra logic executed on the runtime, making it __faster__.
- It's behavior didn't change on the runtime, making it easy to learn and debug.
- Generated code played nicely with code suggestions in IDEs and Mypy without extra work.

Ariadne Codegen has grown from a complete rewrite of the original code generator that was created and used internally by a member of the Saleor Integrations Team.


## Ariadne Codegen

Ariadne Codegen can be installed from pip:

```
$ pip install ariadne-codegen
```

This will give you a new command, `ariadne-codegen`, which consumes the `ariadne-codegen` configuration from the `pyproject.toml` file:

```
[ariadne-codegen]
schema_path = "schema.graphql"
queries_path = "queries.graphql"
```

Create `schema.graphql`:

```graphql
type Query {
    hello: String!
}
```

Create `queries.graphql`:

```graphql
query GetHello {
    hello
}
```

Now run the codegen:

```
$ ariadne-codegen
```

New directory `graphql_client` will be created for you. Feel free to explore its contents. It's `__init__.py` file will reexport what can be considered "public API" of your new GraphQL client.

You can now use the client by importing `Client` class from `graphql_client`:

```python
from graphql_client import Client


async def do_smth_with_graphql_api():
    with Client(base_url = "http://my-client.com") as client:
        result = await client.get_hello()
        # `result` will be an instance of Pydantic model representing the result of
        # `GetHello` query!
        print(result.hello)
```


## Available options and features

Ariadne Codegen already provides quite a few configuration and customization options:

- It can be setup to generate either async or sync GraphQL client.
- It can be told to use custom base HTTP client class instead of default one.
- It can include extra files in the final package.
- Generated classes can be extended with extra behaviors using the `@mixin(...)` directive.

See the [readme file](https://github.com/mirumee/ariadne-codegen#readme) for all available options.


## Known limitations

File uploads and GraphQL subscriptions are not supported.

Remote schemas need to be downloaded to a local file as remote schemas are not supported.


## Moving forward

You are welcome to share the love and give feedback for this library on [Ariadne forums](https://github.com/mirumee/ariadne/discussions)!

If you've found a bug or have a PR, please use [Github issues](https://github.com/mirumee/ariadne-codegen/issues/).

We've already started planning new features and improvements. Those are also public on [project's Github](https://github.com/mirumee/ariadne-codegen/issues/).

