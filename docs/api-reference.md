---
id: api-reference
title: API reference
sidebar_label: ariadne
---

The following items are importable directly from the `ariadne` package:


## `EnumType`

```python
EnumType(name, values)
```

A [_bindable_](bindables.md) used for mapping python values to enumeration members defined in GraphQL schema.


### Required arguments

#### `name`

`str` with the name of the enumeration type defined in the schema.


#### `values`

A `dict`, an `enum.Enum` or an `enum.IntEnum` instance that defines mappings between Enum members and values.


### Example

Enum defined in the schema:

```graphql
enum ErrorType {
  NOT_FOUND
  PERMISSION_DENIED
  VALIDATION_ERROR
}
```

A Python mapping using `dict`:

```python
from ariadne import EnumType


error_type_enum = EnumType(
    "ErrorType",
    {
      "NOT_FOUND": "NotFound",
      "PERMISSION_DENIED": "PermissionDenied",
      "VALIDATION_ERROR": "ValidationError",
    }
)
```

A Python mapping using `enum.Enum`:

```python
from enum import Enum

from ariadne import EnumType


class ErrorType(Enum):
    NOT_FOUND = "NotFound"
    PERMISSION_DENIED = "PermissionDenied"
    VALIDATION_ERROR = "ValidationError"


error_type_enum = EnumType("ErrorType", ErrorType)
```


- - - - -


## `FallbackResolversSetter`

```python
FallbackResolversSetter()
```

A [_bindable_](bindables.md) used for setting the default resolvers on the schema object types.

> It uses the [`fallback_resolvers`](#fallback_resolvers) instead of instantiating `FallbackResolversSetter`.


### Custom default resolver example

You can create custom classes by extending `FallbackResolversSetter` to set your own default resolver on your GraphQL object types:

```python
from ariadne import FallbackResolversSetter


def custom_resolver(obj, info, **kwargs) -> Any:
    try:
        return obj.get(info.field_name)
    except AttributeError:
        return getattr(obj, info.field_name, None)


class CustomFallbackResolversSetter(FallbackResolversSetter):
    def add_resolver_to_field(self, field_name, field_object):
        if field_object.resolve is None:
            field_object.resolve = custom_resolver
```


- - - - -


## `InterfaceType`

```python
InterfaceType(name, type_resolver=None)
```

A [_bindable_](bindables.md) used for setting a custom Python logic for the GraphQL interfaces. It extends [`ObjectType`](#objecttype).

> Because `InterfaceType` extends `ObjectType`, it can also be used to set field resolvers.
>
> InterfaceType will set its resolvers on fields of GraphQL types implementing the interface, but only if there is no resolver already set on the field.


### Required arguments

#### `name`

A `str` with name of interface type defined in schema.


### Optional arguments

#### `type_resolver`

Validates [resolver](types-reference.md#resolver) that is used to resolve the GraphQL type to which `obj` belongs. It should return a `str` with the name of the type. It's not needed if `obj` contains a `__typename` key or attribute.


### Methods

#### `set_type_resolver`

```python
InterfaceType.set_type_resolver(type_resolver)
```

Sets the type [resolver](types-reference.md#resolver) used to resolve the `str` with the name of the GraphQL type to which `obj` belongs to.

It returns value passed to `type_resolver` argument.


#### `type_resolver`

Decorator counterpart of `set_type_resolver`:

```python
search_result = InterfaceType("SearchResult")


@search_result.type_resolver
def resolve_search_result_type(obj, info):
    ...
```

The decorator doesn't change and doesn't wrap the decorated function with any additional logic.


### Example

An interface type for search results that can either be `User` or `Thread`, that defines the url field and sets a default resolver for it:

```graphql
interface SearchResult {
  url: String!
}
```

```python
search_result = InterfaceType("SearchResult")


@search_result.type_resolver
def resolve_search_result_type(obj, info):
    if isinstance(obj, User):
        return "User"
    if isinstance(obj, Thread):
        return "Thread"


@search_result.field("url")
def resolve_search_result_url(obj, info):
    return obj.get_absolute_url()
```


- - - - -


## `MutationType`

```python
MutationType()
```

A [_bindable_](bindables.md) used for setting Python logic for the GraphQL mutation type. It has the same API as [`ObjectType`](#objecttype), but has its GraphQL type name hardcoded to `Mutation`.

> This is a convenient utility that can be used in place of of `ObjectType("Mutation")`.


- - - - -


## `ObjectType`

```python
MutationType(name)
```

A [_bindable_](bindables.md) used for setting Python logic for the GraphQL object types.


### Required arguments

#### `name`

A `str` with the name of an object type defined in the schema.


### Methods

#### `field`

A decorator that takes a single parameter: `name` of the GraphQL field, and sets the decorated callable as [a resolver](types-reference.md#resolver) for it:

```python
user = ObjectType("User")


@user.field("posts")
def resolve_posts(obj, info):
    ...
```

The decorator doesn't change and doesn't wrap the decorated function with any additional logic.


#### `set_alias`

```python
ObjectType.set_alias(name, to)
```

Makes a field `name` defined in the schema resolve to the property `to` of an object.

For example, if you want the field `username` from the schema to resolve the attribute `user_name` to the `User` Python Object, you can set an alias:

```python
user = ObjectType("User")
user.set_alias("username", "user_name")
```


#### `set_field`

```python
ObjectType.set_field(name, resolver)
```

Sets [`resolver`](types-reference.md#resolver) as resolver that will be used to resolve the GraphQL field `name`.

Returns the value passed to the `resolver` argument.


- - - - -


## `QueryType`

```python
QueryType()
```

[_Bindable_](bindables.md) used for setting Python logic for the GraphQL mutation type. It has the same API as [`ObjectType`](#objecttype), but it has the GraphQL type name hardcoded to `Query`.

> This is a convenience utility that can be used in place of of `ObjectType("Query")`.


- - - - -


## `ScalarType`

```python
ScalarType(name, *, serializer=None, value_parser=None, literal_parser=None)
```

[_Bindable_](bindables.md) used for setting the Python logic for GraphQL scalar type.


### Required arguments

#### `name`

`str` with the name of scalar type defined in schema.


#### `serializer`

Callable that is called to convert scalar values into JSON-serializable objects.


#### `value_parser`

A callable that is called to convert JSON-serialized values back into Python objects.


#### `literal_parser`

A callable that is called to convert the AST `ValueNode` value into a Python object.


### Methods

#### `literal_parser`

A decorator that sets the decorated callable as a literal parser for the given scalar:

```python
datetime = ScalarType("DateTime")


@datetime.literal_parser
def parse_datetime_literal(ast):
    ...
```

The decorator doesn't change and doesn't wrap the decorated function with any additional logic.


#### `serializer`

A decorator that sets a decorated callable as a serializer for the given scalar:

```python
datetime = ScalarType("DateTime")


@datetime.serializer
def serialize_datetime(value):
    ...
```

The decorator doesn't change and doesn't wrap the decorated function with any additional logic.


#### `set_serializer`

```python
ScalarType.set_serializer(serializer)
```

Sets `serializer` callable as a serializer for the scalar.


#### `set_literal_parser`

```python
ScalarType.set_value_parser(literal_parser)
```

Sets `literal_parser` callable as a literal parser for the scalar.


#### `set_value_parser`

```python
ScalarType.set_value_parser(value_parser)
```

Sets `value_parser` callable as value parser for the scalar.

> As convenience, this function will also set literal parser, if none was set already.


#### `value_parser`

A decorator that sets the decorated callable as a value parser for the given scalar:

```python
datetime = ScalarType("DateTime")


@datetime.value_parser
def parse_datetime_value(value):
    ...
```

The decorator doesn't change and doesn't wrap the decorated function with any additional logic.

> For convenience, this decorator will also set a literal parser, if none was set already.


### Example

A read-only scalar that converts `datetime` object to string containing ISO8601 formatted date:

```python
datetime = ScalarType("DateTime")


@datetime.serializer
def serialize_datetime(value):
    return value.isoformat()
```

A bidirectional scalar that converts the given `date` object to a ISO8601 formatted date and reverses it back:

```python
from datetime import date

date_scalar = ScalarType("Date")


@date.serializer
def serialize_datetime(value):
    return value.isoformat()


@date.value_parser
def serialize_datetime(value):
    return date.strptime(value, "%Y-%m-%d")
```


- - - - -


## `SnakeCaseFallbackResolversSetter`

```python
SnakeCaseFallbackResolversSetter()
```

This [_bindable_](bindables.md) is used for setting the default resolver on the schema object types. It subclasses [`FallbackResolversSetter`](#fallbackresolverssetter) and it sets the default resolver that performs case conversion between GraphQL's `camelCase` and Python's `snake_case`:

```graphql
type User {
  "Default resolver for this field that will read the value from contact_address"
  contactAddress: String
}
```

> Use [`fallback_resolvers`](#snake_case_fallback_resolvers) instead of instantiating `SnakeCaseFallbackResolversSetter`.


- - - - -


## `SubscriptionType`

```python
SubscriptionType()
```

A [_bindable_](bindables.md) used for setting a Python logic to the GraphQL subscription type.

> Like [`QueryType`](#querytype) and [`MutationType`](#mutationtype) this type is hardcoded to bind only to the `Subscription` type in schema.


### Methods

#### `field`

A decorator that takes a single parameter: `name` of the GraphQL field, and sets the decorated callable as its resolver.

```python
subscription = SubscriptionType()


@subscription.field("alerts")
def resolve_alerts(obj, info):
    ...
```

The decorator doesn't change and doesn't wrap the decorated function with any additional logic.

> The root resolvers set on the subscription type are called with the value returned by the field's `source` resolver as the first argument.

#### `set_field`

```python
SubscriptionType.set_field(name, resolver)
```

It sets the `resolver` callable as a resolver that will be used to resolve the GraphQL field `name`.

It returns the value passed to the `resolver` argument.

> The root resolvers set on the subscription type are called with the value returned by the field's `source` resolver as the first argument.


#### `set_source`

```python
SubscriptionType.set_source(name, generator)
```

Sets the given `generator` as the source that will be used to resolve the GraphQL field `name`.

It returns the value passed to the `generator` argument.


#### `source`

A decorator that takes a single parameter: `name` of the GraphQL field, and sets the decorated generator its source.

```python
subscription = SubscriptionType()


@subscription.source("alerts")
async def alerts_generator(obj, info):
    ...
```

The ecorator doesn't change and doesn't wrap the decorated function with any additional logic.


### Example

Simple counter API that counts to 5 and ends subscription:

```graphql
type Subscription {
  counter: Int
}
```

```python
import asyncio


subscription = SubscriptionType()


@subscription.source("counter")
async def counter_generator(obj, info):
    for i in range(5):
        await asyncio.sleep(1)
        yield i


@subscription.field("counter")
def counter_resolver(count, info):
    return count
```

- - - - -


## `UnionType`

```python
UnionType(name, type_resolver=None)
```

A [_bindable_](bindables.md) used for setting a Python logic for the GraphQL union type.


### Required arguments

#### `name`

`str` with the name of union type defined in the schema.


### Optional arguments

#### `type_resolver`

It validates the [resolver](types-reference.md#resolver) that is used to resolve the GraphQL type to which the `obj` belongs to. It should return a `str` with the name of the type. It is not needed if `obj` contains a `__typename` key or attribute.


### Methods

#### `set_type_resolver`

```python
UnionType.set_type_resolver(type_resolver)
```

Sets the type [resolver](types-reference.md#resolver) used to resolve the `str` with the name of the GraphQL type to which the `obj` belongs to.

It returns the value passed to the `type_resolver` argument.


#### `type_resolver`

A decorator counterpart of `set_type_resolver`:

```python
search_result = UnionType("SearchResult")


@search_result.type_resolver
def resolve_search_result_type(obj, info):
    ...
```

The decorator doesn't change and doesn't wrap the decorated function with any additional logic.


### Example

Union type for search results that can be `User` or `Thread`:

```graphql
union SearchResult = User | Thread
```

```python
search_result = UnionType("SearchResult")


@search_result.type_resolver
def resolve_search_result_type(obj, info):
    if isinstance(obj, User):
        return "User"
    if isinstance(obj, Thread):
        return "Thread"
```


- - - - -


## `combine_multipart_data`

```python
combine_multipart_data(operations, files_map, files)
```

It combines the data from a [GraphQL multipart request](https://github.com/jaydenseric/graphql-multipart-request-spec) into a query [`data`](#data).


### Required arguments

#### `operations`

`dict` containing the GraphQL query data or `list` of those.


#### `files_map`

`dict` containing the data mapping `files` to the `Query` variables.


#### `files`

`dict` (or an object implementing `__getitem__`) containing the uploaded files.


- - - - -


## `convert_camel_case_to_snake`

```python
convert_camel_case_to_snake(graphql_name)
```

An utility function that converts the GraphQL name written in `camelCase` to its Python `snake_case` counterpart.


- - - - -


## `default_resolver`

```python
def default_resolver(parent, info)
```

The default resolver used by Ariadne. If `parent` is a `dict`, it will use `dict.get(info.field_name)` to resolve the value. Otherwise, it will use `getattr(parent, info.field_name, None)`.


- - - - -


## `fallback_resolvers`

```python
fallback_resolvers
```

a [_bindable_](bindables.md) instance of [`FallbackResolversSetter`](#fallbackresolverssetter).


- - - - -


## `format_error`

```python
def format_error(error, debug=False)
```

The default error formatter used by Ariadne. It takes an instance of `GraphQLError` as the first argument and the debug flag for the second.

It returns a `dict` containing the formatted error data ready to be returned to the API client.

If `debug` is `True`, it updates the returned data `extensions` key with `exception`; a `dict` that contains the traceback to original Python exception and its context variables.


- - - - -


## `get_error_extension`

```python
def get_error_extension(error)
```

It takes a `GraphQLError` instance and returns a `dict` with the traceback and the context of the original Python exception. If an error was not caused by an exception in the resolver, it returns `None` instead.

- - - - -


## `gql`

```python
def gql(value)
```

An utility function that takes a GraphQL string, validates it and returns the same string unchanged or raises `GraphQLError` if the string was invalid.

Wrapping GraphQL strings declarations with this utility makes it easier to track down and debug errors, as their traceback will point to the place of their declaration instead of Ariadne' internals:

```python
type_defs = gql("""
    type Query {
      username: String!
    }
""")
```


- - - - -


## `graphql`

```python
async def graphql(schema, data, *, root_value=None, context_value=None, logger=None, debug=False, validation_rules, error_formatter, middleware, **kwargs)
```

It asynchronously executes a query against the schema.

It returns [`GraphQLResult`](types-reference.md#graphqlresult) instance.

> This function is an asynchronous coroutine so you will need to `await` the returned value.

> The coroutines will not work under WSGI. If your server uses WSGI (Django and Flask for example), use [`graphql_sync`](#graphql_sync) instead.


### Required arguments

#### `schema`

An executable schema created using [`make_executable_schema`](#make_executable_schema).


#### `data`

The decoded input data sent by the client (e.g. for POST requests in JSON format, it passes the structure decoded from JSON). The exact shape of `data` depends on the query type and the protocols.


### Configuration options

#### `context_value`

The [context value](types-reference.md#contextvalue) to be passed to the resolvers.

> If `context_value` is callable, it should be evaluated on higher level of abstraction (in server integration) before passing to `graphql()`.


#### `root_value`

The [root value](types-reference.md#rootvalue) to be passed to the root resolvers.


#### `logger`

A string with the name of the logger that should be used to log the GraphQL errors. Defaults to `ariadne`.


#### `debug`

If `True`, it will cause the server to include debug information in the error responses.


#### `validation_rules`

Any additional validators (as defined by `graphql.validation.rules`) to run before attempting to execute the query (the standard validators defined by the GraphQL specification are always used and there's no need to provide them here).


#### `error_formatter`

The [error formatter](types-reference.md#errorformatter) that should be used to format errors.

Defaults to [`format_error`](#format_error).


#### `middleware`

An optional middleware to wrap the resolvers with.


- - - - -


## `graphql_sync`

```python
def graphql(schema, data, *, root_value=None, context_value=None, debug=False, validation_rules, error_formatter, middleware, **kwargs)
```

Synchronously executes a query against the schema.

It returns a [`GraphQLResult`](types-reference.md#graphqlresult) instance.

> Use this function instead of [`graphql`](#graphql) to run queries in synchronous servers (WSGI, Django, Flask, etc).


### Required arguments

See [`graphql`](#graphql) for the required arguments.


### Configuration options

See [`graphql`](#graphql) for the configuration options.


- - - - -


## `load_schema_from_path`

```python
def load_schema_from_path(path)
```

Loads the GraphQL schema from the given `path` using different strategies depending on the `path`'s type:

- If `path` is a single file, it reads it.
- If `path` is a directory, it walks it recursively by loading all `.graphql` files within it.

The files are validated using the same logic used by [`gql`](#gql), and concatenated into a single string and then returned.


- - - - -


## `make_executable_schema`

```python
def make_executable_schema(type_defs, bindables=None)
```

It takes two arguments:

- `type_defs` - a string or list of strings with valid GraphQL types definitions.
- `bindables` - a [bindable or a list of bindables](bindables.md) with any Python logic to add to the schema. *Optional*.

It returns a `GraphQLSchema` instance that can be used to run queries onto.


- - - - -


## `resolve_to`

```python
def resolve_to(name)
```

It returns the [`default_resolver`](#default_resolver) that always resolves to named attribute. Used by [`ObjectType.set_alias`](#set_alias) to create aliases.

- - - - -


## `snake_case_fallback_resolvers`

```python
snake_case_fallback_resolvers
```

A [_bindable_](bindables.md) instance of [`SnakeCaseFallbackResolversSetter`](#snakecasefallbackresolverssetter).


- - - - -


## `subscribe`

```python
async def subscribe(schema, data, *, root_value=None, context_value=None, debug=False, validation_rules, error_formatter, **kwargs)
```

Asynchronously executes a subscription query against the schema, usually made over the websocket. It takes the same arguments and options as [`graphql`](#graphql) except `middleware`.

> This function is an asynchronous coroutine so you will need to `await` the returned value.

> Coroutines will not work under WSGI. If your server uses WSGI (Django and Flask for example), use [`graphql_sync`](#graphql_sync) instead.


- - - - -


## `upload_scalar`

```python
upload_scalar
```

An instance of [`ScalarType`](#scalartype) that represents the uploaded file.

See the [file uploads](file-uploads.md) documentation for information about the [limitations](file-uploads.md#limitations) and [implementation specific](file-uploads.md#implementation-differences) differences in behaviour.
