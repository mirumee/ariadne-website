---
id: types-reference
title: Types reference
sidebar_label: ariadne.types
---

Ariadne uses [type annotations](https://www.python.org/dev/peps/pep-0484/) in its codebase.

Many parts of its API share or rely on common types, importable from `ariadne.types` module:


## `ContextValue`

```python
Any
```

```python
def get_context_value(request):
```

Context value that should be passed to [resolvers] through the [`info.context`](#info). Can be of any type.

If value is callable, it will be called with single argument:

- `request` - representation of HTTP request specific to the web stack used by your API.

Return value will then be used as final `context` passed to resolvers.


- - - - -


## `ErrorFormatter`

```python
def format_error(error, debug):
```

Callabe used to format errors into JSON-serializable form.

Should return a Python `dict`.


### Required arguments

#### `error`

Instance of [`graphql.error.GraphQLError`](https://github.com/graphql-python/graphql-core-next/blob/v1.0.5/graphql/error/graphql_error.py#L15) to be formatted.


#### `debug`

Boolean controlling if debug information should be included in formatted data.


- - - - -


## `Extension`

```python
class Extension()
```

Base class for [extensions](extensions.md).


### Methods

#### `execution_finished`

```python
Extension.execution_finished(context, error=None)
```

Called when query execution finishes.


#### `execution_started`

```python
Extension.execution_started(context)
```

Called when query execution starts.


#### `format`

```python
Extension.format()
```

Allows extensions to add data to `extensions` key in GraphQL response.

Should return dict.

##### Example

Following extension will add `timestamp` entry with current timestamp to query's `extensions`:

```python
from datetime import datetime


class TimestampExtension(Extension):
    def format(self):
        return {"timestamp": datetime.now().isoformat()}
```

Result:

```json
{
    "data": {
        "hello": "world!"
    },
    "extensions": {
        "timestamp": "2019-06-28T18:34:31.171409"
    }
}
```

#### `has_errors`

```python
Extension.has_errors(errors)
```

Called with `list` of errors that occurred during query process. Not called if no errors were raised. Errors may come from `validation`, query parsing or query execution.


#### `parsing_finished`

```python
Extension.parsing_finished(query, error=None)
```

Called when query parsing finishes. Receives `str` with unparsed query as first argument.


#### `parsing_started`

```python
Extension.parsing_started(query)
```

Called when query parsing starts. Receives `str` with unparsed query as first argument.


#### `request_finished`

```python
Extension.request_finished(context, error=None)
```

Called when query processing finishes.


#### `request_started`

```python
Extension.request_started(context)
```

Called when query processing starts.


#### `resolve`

```python
Extension.resolve(next_, parent, info[, **kwargs])
```

Used as middleware for fields resolver. Takes special `next_` argument that is next resolver in resolvers chain that should be called.

Everything else is same as with regular [resolvers](#resolver).


#### `validation_finished`

```python
Extension.validation_finished(context, error=None)
```

Called when query validation finishes.


#### `validation_started`

```python
Extension.validation_started(context)
```

Called when query validation starts.


- - - - -


## `GraphQLResult`

```python
(success, response)
```

A tuple of two items:

- `success` - web server should use status code `200` for response if this value is `True` and `400` if it wasn't.
- `response` - response data that should be JSON-encoded and sent to client.


- - - - -


## `Resolver`

```python
def resolver(obj, info[, **kwargs]):
```

```python
class Resolver:
    def __call__(self, obj, info[, **kwargs]):
```

```python
lambda obj, info[, **kwargs]:
```

A callable that query executor runs to resolve a specific field's value.

> Returning `None` from resolver for field declared as non-nullable (eg.: `field: Int!`) will result in `TypeError` being raised by the query executor.


### Required arguments

#### `obj`

Object from which the value should be resolved. Can be `None` for root resolvers (resolvers for [`Query`](resolvers.md), [`Mutation`](mutations.md) and [`Subscription`](subscriptions.md) fields) in server without set [`RootValue`](#rootvalue).


#### `info`

Instance of the [`graphql.type.GraphQLResolveInfo`](https://github.com/graphql-python/graphql-core-next/blob/v1.0.5/graphql/type/definition.py#L487). Is specific to resolved field and query.

Has `context` attribute that contains [`ContextValue`](#contextvalue) specific to the server implementation.


#### `**kwargs`

If resolver's GraphQL field accepts any arguments, those arguments values will be passed to the field as kwargs:

```graphql
type Query {
    sum(a: Int, b: Int): Int!
}
```

```python
def resolve_users(obj, info, *, a=0, b=0):
    return a + b
```

If argument is declared required (eg.: `a: Int!`), default value is not required because value presence will be asserted by Query executor before resolver is called:

```python
def resolve_users(obj, info, *, a, b=0):
    return a + b  # a is guaranteed to have a value
```

- - - - -


## `RootValue`

```python
Any
```

```python
def get_root_value(context, document):
```

The value that should be passed to the root-level [resolvers](#resolver) as their [`obj`](#obj). Can be of any type.

If value is callable, it will be called with two arguments:

- `context` - containing current `context_value`.
- `document` - [`graphql.ast.DocumentNode`](https://github.com/graphql-python/graphql-core-next/blob/v1.0.5/graphql/language/ast.py#L180) that was result of parsing current GraphQL query.

Return value will then be used as `obj` passed to root resolvers.


- - - - -


## `SchemaBindable`

```python
class SchemaBindable()
```

Base class for [_bindables_](bindables.md).


### Methods

#### `bind_to_schema`

```python
SchemaBindable.bind_to_schema(schema)
```

Method called by `make_executable_schema` with single argument being instance of GraphQL schema. Extending classes should override this method with custom logic that binds business mechanic to schema.


- - - - -


## `Subscriber`

```python
async def source(value, info[, **kwargs])
```

Asynchronous generator that [subscription](subscriptions.md) field uses as data source for its [resolver](#resolver).


### Required arguments

#### `root_value`

[Root value](#rootvalue) set on the server.


#### `info`

Instance of the [`graphql.type.GraphQLResolveInfo`](https://github.com/graphql-python/graphql-core-next/blob/v1.0.5/graphql/type/definition.py#L487). Is specific to resolved field and query.

Has `context` attribute that contains [`ContextValue`](#contextvalue) specific to the server implementation.


#### `**kwargs`

If subscriptions's GraphQL field accepts any arguments, those arguments values will be passed to the field as kwargs:

```graphql
type Subscription {
    alerts(level: Int, age: Int): Int!
}
```

```python
async def alerts_source(obj, info, *, level=0, age=0):
    yield from alerts.subscribe(level, age)
```

If argument is declared required (eg.: `age: Int!`), default value is not required because value presence will be asserted by Query executor before subscriber is called:

```python
async def alerts_source(obj, info, *, level=0, age):
    yield from alerts.subscribe(level, age)
```



- - - - -


## `SubscriptionResult`

```python
(success, response)
```

A tuple of two items:

- `success` - web server should use status code `200` for response if this value is `True` and `400` if it wasn't.
- `response` - asynchronous generator for response data that should be JSON-encoded and sent to client for the duration of the connection.


