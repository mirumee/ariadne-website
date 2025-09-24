---
id: version-0.5.0-file-uploads
title: File uploads
original_id: file-uploads
---

Ariadne implements the [GraphQL multipart request specification](https://github.com/jaydenseric/graphql-multipart-request-spec) that describes how file uploads should be implemented by both API clients and servers.


## Enabling file uploads

To enable file uploads on your server, define new scalar named `Upload` in your schema:

```graphql
scalar Upload
```

Next, import `upload_scalar` from `ariadne` package and use it during executable schema creation:

```python
from ariadne import make_executable_schema, upload_scalar

# ...your types definitions

schema = make_executable_schema(type_defs, [..., upload_scalar])
```

You will now be able to use `Upload` scalar arguments for your operations:

```graphql
type Mutation {
    uploadUserImage(image: Upload!): Boolean!
}
```


## Limitations

Default `Upload` scalar is write-only scalar that supports only accessing the value that was passed through the `variables`. It is not possible to use it as return value for GraphQL field or set its value in GraphQL Query:

```graphql
type User {
    "This field will fail with ValueError"
    image: Upload
}
```

```graphql
mutation {
    uploadUserImage(image: "data:text/plain;base64,QXJpYWRuZSByb2NrcyE=")
}
```

> You are not required to use the `Upload` scalar implementation provided by Ariadne. You can implement your own if you wish to, so you can (for example) support file literals as base64 data.


## Implementation differences

Python value returned by `Upload` scalar is not standardized and depends on your technology stack:


### `ariadne.asgi`

ASGI application is based on [Starlette](https://starlette.io) and hence uploaded files are instances of [`UploadFile`](https://www.starlette.io/requests/#request-files).


### `ariadne.wsgi`

WSGI application uses the `cgi` module from Python's standard library that represents uploaded files as instances of [`FieldStorage`](https://docs.python.org/3/library/cgi.html#using-the-cgi-module).

> Data in `FieldStorage` is not guaranteed to represent an uploaded file.


### `ariadne.contrib.django`

Django integration uses `request.FILES` to obtain uploaded files. Depending on file uploads configuration in your Django project, the files are instances of [`UploadedFile`](https://docs.djangoproject.com/en/2.2/ref/files/uploads/) or one of its subclasses.
