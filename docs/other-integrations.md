---
id: other-integrations
title: Other technologies
---


Ariadne can be used to add GraphQL server to projects developed using any web framework that supports JSON responses.

Implementation details differ between frameworks, but same steps apply for most of them:

1. Use `make_executable_schema` to create executable schema instance.
2. Create view, route or controller (semantics vary between frameworks) that accepts `GET` and `POST` requests.
3. If request was made with `GET` method, return response containing GraphQL Playground's HTML.
4. If request was made with `POST`, disable any CSRF checks, test that its content type is `application/json` then parse its content as JSON. Return `400 BAD REQUEST` if this fails.
5. Call `graphql_sync` with schema, parsed JSON and any other options that are fit for your implementation.
6. `graphql_sync` returns tuple that has two values: `boolean` and `dict`. Use dict as data for JSON response, and boolean for status code. If boolean is `true`, set response's status code to `200`, otherwise it should be `400`

See the [Flask integration](flask-integration.md) for implementation of this algorithm using Flask framework.


## `graphql`

```python
graphql(schema, data, *, root_value=None, context_value=None, debug=False, validation_rules, error_formatter, middleware, **kwargs)
```

Function returns a tuple of two values, `(success, response)` containing the success indicator (boolean), and the response that should be json encoded and sent to client.

This function is an asynchronous coroutine so you will need to `await` on the returned value.

> Coroutines will not work under WSGI. If your server uses WSGI (Django and Flask do), use `graphql_sync` instead.


### Required arguments

#### `schema`
An executable schema created using `make_executable_schema`.


#### `data`
Decoded input data sent by the client (eg. for POST requests in JSON format, pass in the structure decoded from JSON). Exact shape of `data` depends on the query type and protocol.


### Configuration options

#### `context_value`

The context value passed to all resolvers (it's common for your context to include the request object specific to your web framework).


#### `root_value`

The value passed to the root-level resolvers.


#### `debug`

If `True` will cause the server to include debug information in error responses.


#### `validation_rules`

optional additional validators (as defined by `graphql.validation.rules`) to run before attempting to execute the query (the standard validators defined by the GraphQL specification are always used and There's no need to provide them here).


#### `error_formatter`

An optional custom function to use for formatting errors, the function will be passed two parameters: a `GraphQLError` exception instance, and the value of the `debug` switch.


#### `middleware`

Optional middleware to wrap the resolvers with.


## `graphql_sync`

```python
graphql_sync(schema, data, *, root_value=None, context_value=None, debug=False, validation_rules, error_formatter, middleware, **kwargs)
```

This function is synchronous counterpart of `graphql`. Parameters are the same as those of the `graphql` coroutine above but the function is blocking and the result is returned synchronously. Use this function if your site is running under WSGI.


## `subscribe`

```python
subscribe(schema, data, *, root_value=None, context_value=None, debug=False, validation_rules, error_formatter, **kwargs)
```

Parameters are the same as those of the `graphql` coroutine except for the `middleware` parameter that is not supported.

> This function is an asynchronous coroutine so you will need to `await` on the returned value. It requires your server to use ASGI.
