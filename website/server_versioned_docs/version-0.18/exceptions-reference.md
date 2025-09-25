---
id: version-0.18-exceptions-reference
title: Exceptions reference
sidebar_label: ariadne.exceptions
original_id: exceptions-reference
---

Ariadne defines some custom exception types that can be imported from `ariadne.exceptions` module:



## `GraphQLFileSyntaxError`

```python
class GraphQLFileSyntaxError(Exception):
    ...
```

Raised by `load_schema_from_path` when loaded GraphQL file has invalid syntax.


### Constructor

```python
def __init__(self, file_path: Union[str, os.PathLike], message: str):
    ...
```

Initializes the `GraphQLFileSyntaxError` with file name and error.


#### Required arguments

`file_path`: a `str` or `PathLike` object pointing to a file that
failed to validate.

`message`: a `str` with validation message.


### Methods

#### `format_message`

```python
def format_message(
    self,
    file_path: Union[str, os.PathLike],
    message: str,
) -> None:
    ...
```

Builds final error message from path to schema file and error message.

Returns `str` with final error message.


##### Required arguments

`file_path`: a `str` or `PathLike` object pointing to a file that
failed to validate.

`message`: a `str` with validation message.


#### `__str__`

```python
def __str__(self) -> None:
    ...
```

Returns error message.


- - - - -


## `HttpBadRequestError`

```python
class HttpBadRequestError(HttpError):
    ...
```

Raised when request did not contain the data required to execute
the GraphQL query.


- - - - -


## `HttpError`

```python
class HttpError(Exception):
    ...
```

Base class for HTTP errors raised inside the ASGI and WSGI servers.


### Constructor

```python
def __init__(self, message: Optional[str] = None):
    ...
```

Initializes the `HttpError` with optional error message.


#### Optional arguments

`message`: a `str` with error message to return in response body or
`None`.