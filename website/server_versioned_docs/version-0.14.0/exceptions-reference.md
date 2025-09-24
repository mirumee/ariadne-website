---
id: exceptions-reference
title: Exceptions reference
sidebar_label: ariadne.exceptions
---

Ariadne defines some custom exception types that can be imported from `ariadne.exceptions`:


## `GraphQLFileSyntaxError`

Raised by the [`load_schema_from_path`](api-reference.md#load_schema_from_path) if any of loaded `gql` files contains syntax error.


- - - - -


## `HttpError`

Base class for HTTP errors raised inside the [ASGI](asgi.md) and [WSGI](wsgi.md) servers.


- - - - -


## `HttpBadRequestError`

HTTP request did not contain the data required to execute GraphQL query.


- - - - -


## `HttpMethodNotAllowedError`

HTTP request was made with a HTTP method unsupported by the server.
