---
id: api-reference
title: API reference
sidebar_label: ariadne
---

Following items are importable directly from `ariadne` package:


## `EnumType`

```python
EnumType(name, values)
```

[_Bindable_](bindables.md) used for mapping python values to enumeration members defined in GraphQL schema.


### Required arguments

#### `name`

`str` with name of enumeration type defined in schema.


#### `values`

`dict`, `enum.Enum` or `enum.IntEnum` instance that defines mappings between Enum members and values


### Example

Enum defined in schema:

```graphql
enum ErrorType {
  NOT_FOUND
  PERMISSION_DENIED
  VALIDATION_ERROR
}
```

Python mapping using `dict`:

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

Python mapping using `enum.Enum`:

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

[_Bindable_](bindables.md) used for setting default resolvers on schema object types.

> Use [`fallback_resolvers`](#fallback_resolvers) instead of instantiating `FallbackResolversSetter`.


### Custom default resolver example

You can create custom class extending `FallbackResolversSetter` to set custom default resolver on your GraphQL object types:

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

[_Bindable_](bindables.md) used for setting Python logic for GraphQL interfaces. Extends [`ObjectType`](#objecttype).

> Because `InterfaceType` extends `ObjectType`, it can also be used to set field resolvers.
>
> InterfaceType will set its resolvers on fields of GraphQL types implementing the interface, but only if there is no resolver already set on the field.


### Required arguments

#### `name`

`str` with name of interface type defined in schema.


### Optional arguments

#### `type_resolver`

Valid [resolver](types-reference.md#resolver) that is used to resolve the GraphQL type to which `obj` belongs. It should return a `str` with the name of the type. Not needed if `obj` contains a `__typename` key or attribute.


### Methods

#### `set_type_resolver`

```python
InterfaceType.set_type_resolver(type_resolver)
```

Sets type [resolver](types-reference.md#resolver) used to resolve the `str` with name of GraphQL type to which `obj` belongs to.

Returns value passed to `type_resolver` argument.


#### `type_resolver`

Decorator counterpart of `set_type_resolver`:

```python
search_result = InterfaceType("SearchResult")


@search_result.type_resolver
def resolve_search_result_type(obj, info):
    ...
```

Decorator doesn't change or wrap the decorated function into any additional logic.


### Example

Interface type for search result that can be `User` or `Thread`, that defines the url field and sets default resolver for it:

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

[_Bindable_](bindables.md) used for setting Python logic for GraphQL mutation type. Has the same API as [`ObjectType`](#objecttype), but has GraphQL type name hardcoded to `Mutation`.

> This is an convenience utility that can be used in place of of `ObjectType("Mutation")`.


- - - - -


## `ObjectType`

```python
MutationType(name)
```

[_Bindable_](bindables.md) used for setting Python logic for GraphQL object types.


### Required arguments

#### `name`

`str` with name of an object type defined in schema.


### Methods

#### `field`

Decorator that takes single parameter, `name` of GraphQL field, and sets decorated callable as [a resolver](types-reference.md#resolver) for it:

```python
user = ObjectType("User")


@user.field("posts")
def resolve_posts(obj, info):
    ...
```

Decorator doesn't change or wrap the decorated function into any additional logic.


#### `set_alias`

```python
ObjectType.set_alias(name, to)
```

Makes a field `name` defined in the schema resolve to property `to` of an object.

For example, if you want field `username` from schema resolve to attribute `user_name` of Python object, you can set an alias:

```python
user = ObjectType("User")


user.set_alias("username", "user_name")
```


#### `set_field`

```python
ObjectType.set_field(name, resolver)
```

Sets [`resolver`](types-reference.md#resolver) as resolver that will be used to resolve the GraphQL field named `name`.

Returns value passed to `resolver` argument.


- - - - -


## `QueryType`

```python
QueryType()
```

[_Bindable_](bindables.md) used for setting Python logic for GraphQL mutation type. Has the same API as [`ObjectType`](#objecttype), but has GraphQL type name hardcoded to `Query`.

> This is an convenience utility that can be used in place of of `ObjectType("Query")`.


- - - - -


## `ScalarType`

```python
ScalarType(name, *, serializer=None, value_parser=None, literal_parser=None)
```

[_Bindable_](bindables.md) used for setting Python logic for GraphQL scalar type.


### Required arguments

#### `name`

`str` with name of scalar type defined in schema.


#### `serializer`

Callable that is called to convert scalar value into JSON-serializable form.


#### `value_parser`

Callable that is called to convert JSON-serialized value back into Python form.


#### `literal_parser`

Callable that is called to convert AST `ValueNode` value into Python form.


### Methods

#### `literal_parser`

Decorator that sets decorated callable as literal parser for the scalar:

```python
datetime = ScalarType("DateTime")


@datetime.literal_parser
def parse_datetime_literal(ast):
    ...
```

Decorator doesn't change or wrap the decorated function into any additional logic.


#### `serializer`

Decorator that sets decorated callable as serializer for the scalar:

```python
datetime = ScalarType("DateTime")


@datetime.serializer
def serialize_datetime(value):
    ...
```

Decorator doesn't change or wrap the decorated function into any additional logic.


#### `set_serializer`

```python
ScalarType.set_serializer(serializer)
```

Sets `serializer` callable as serializer for the scalar.


#### `set_literal_parser`

```python
ScalarType.set_value_parser(literal_parser)
```

Sets `literal_parser` callable as literal parser for the scalar.


#### `set_value_parser`

```python
ScalarType.set_value_parser(value_parser)
```

Sets `value_parser` callable as value parser for the scalar.

> As convenience, this function will also set literal parser, if none was set already.


#### `value_parser`

Decorator that sets decorated callable as value parser for the scalar:

```python
datetime = ScalarType("DateTime")


@datetime.value_parser
def parse_datetime_value(value):
    ...
```

Decorator doesn't change or wrap the decorated function into any additional logic.

> As convenience, this decorator will also set literal parser, if none was set already.


### Example

Read-only scalar that converts `datetime` object to string containing ISO8601 formatted date:

```python
datetime = ScalarType("DateTime")


@datetime.serializer
def serialize_datetime(value):
    return value.isoformat()
```

Bidirectional scalar that converts `date` object to ISO8601 formatted date and reverses it back:

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

[_Bindable_](bindables.md) used for setting default resolvers on schema object types. Subclasses [`FallbackResolversSetter`](#fallbackresolverssetter) and sets default resolver that performs case conversion between GraphQL's `camelCase` and Python's `snake_case`:

```graphql
type User {
  "Default resolver for this field will read value from contact_address"
  contactAddress: String
}
```

> Use [`fallback_resolvers`](#snake_case_fallback_resolvers) instead of instantiating `SnakeCaseFallbackResolversSetter`.


- - - - -


## `SubscriptionType`

```python
SubscriptionType()
```

[_Bindable_](bindables.md) used for setting Python logic for GraphQL subscription type.

> Like [`QueryType`](#querytype) and [`MutationType`](#mutationtype) this type is hardcoded to bind only to `Subscription` type in schema.


### Methods

#### `field`

Decorator that takes single parameter, `name` of GraphQL field, and sets decorated callable as resolver for it.

```python
subscription = SubscriptionType()


@subscription.field("alerts")
def resolve_alerts(obj, info):
    ...
```

Decorator doesn't change or wrap the decorated function into any additional logic.

> Root resolvers set on subscription type are called with value returned by field's `source` resolver as first argument.

#### `set_field`

```python
SubscriptionType.set_field(name, resolver)
```

Sets `resolver` callable as resolver that will be used to resolve the GraphQL field named `name`.

Returns value passed to `resolver` argument.

> Root resolvers set on subscription type are called with value returned by field's `source` resolver as first argument.


#### `set_source`

```python
SubscriptionType.set_source(name, generator)
```

Sets `generator` generator as source that will be used to resolve the GraphQL field named `name`.

Returns value passed to `generator` argument.


#### `source`

Decorator that takes single parameter, `name` of GraphQL field, and sets decorated generator as source for it.

```python
subscription = SubscriptionType()


@subscription.source("alerts")
async def alerts_generator(obj, info):
    ...
```

Decorator doesn't change or wrap the decorated function into any additional logic.


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

[_Bindable_](bindables.md) used for setting Python logic for GraphQL union type.


### Required arguments

#### `name`

`str` with name of union type defined in schema.


### Optional arguments

#### `type_resolver`

Valid [resolver](types-reference.md#resolver) that is used to resolve the GraphQL type to which `obj` belongs. It should return a `str` with the name of the type. Not needed if `obj` contains a `__typename` key or attribute.


### Methods

#### `set_type_resolver`

```python
UnionType.set_type_resolver(type_resolver)
```

Sets type [resolver](types-reference.md#resolver) used to resolve the `str` with name of GraphQL type to which `obj` belongs to.

Returns value passed to `type_resolver` argument.


#### `type_resolver`

Decorator counterpart of `set_type_resolver`:

```python
search_result = UnionType("SearchResult")


@search_result.type_resolver
def resolve_search_result_type(obj, info):
    ...
```

Decorator doesn't change or wrap the decorated function into any additional logic.


### Example

Union type for search result that can be `User` or `Thread`:

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

Combines data from [GraphQL multipart request](https://github.com/jaydenseric/graphql-multipart-request-spec) into a query [`data`](#data).


### Required arguments

#### `operations`

`dict` containing GraphQL query data or `list` of those.


#### `files_map`

`dict` containing data mapping `files` to Query variables.


#### `files`

`dict` (or object implementing `__getitem__`) containing uploaded files.


- - - - -


## `convert_camel_case_to_snake`

```python
convert_camel_case_to_snake(graphql_name)
```

Utility function that converts GraphQL name written in `camelCase` to its Python `snake_case` counterpart.


- - - - -


## `default_resolver`

```python
def default_resolver(parent, info)
```

Default resolver used by Ariadne. If `parent` is `dict`, will use `dict.get(info.field_name)` to resolve the value. Uses `getattr(parent, info.field_name, None)` otherwise.


- - - - -


## `fallback_resolvers`

```python
fallback_resolvers
```

[_Bindable_](bindables.md) instace of [`FallbackResolversSetter`](#fallbackresolverssetter).


- - - - -


## `format_error`

```python
def format_error(error, debug=False)
```

Default error formatter used by Ariadne. Takes instance of `GraphQLError` as first argument and debug flag as second.

Returns `dict` containing formatted error data ready for returning to API client.

If `debug` is `True`, updates returned data `extensions` key with `exception` `dict` that contains traceback to original Python exception and its context variables.


- - - - -


## `get_error_extension`

```python
def get_error_extension(error)
```

Takes `GraphQLError` instance as only argument and returns `dict` with traceback and context of original Python exception. If error was not caused by exception in resolver, returns `None` instead.

- - - - -


## `gql`

```python
def gql(value)
```

Utility function that takes GraphQL string as only argument, validates it and returns same string unchanged or raises `GraphQLError` if string was invalid.

Wrapping GraphQL strings declarations with this utility will make errors easier to track down and debug, as their traceback will point to place of declaration instead of Ariadne internals:

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

Asynchronously executes query against the schema.

Returns [`GraphQLResult`](types-reference.md#graphqlresult) instance.

> This function is an asynchronous coroutine so you will need to `await` on the returned value.

> Coroutines will not work under WSGI. If your server uses WSGI (Django and Flask do), use [`graphql_sync`](#graphql_sync) instead.


### Required arguments

#### `schema`

An executable schema created using [`make_executable_schema`](#make_executable_schema).


#### `data`

Decoded input data sent by the client (eg. for POST requests in JSON format, pass in the structure decoded from JSON). Exact shape of `data` depends on the query type and protocol.


### Configuration options

#### `context_value`

[Context value](types-reference.md#contextvalue) to be passed to resolvers.

> If `context_value` is callable, it should be evaluated on higher level of abstraction (in server integration) before passing to `graphql()`.


#### `root_value`

[Root value](types-reference.md#rootvalue) to be passed to root resolvers.


#### `logger`

String with the name of logger that should be used to log GraphQL errors. Defaults to `ariadne`.


#### `debug`

If `True` will cause the server to include debug information in error responses.


#### `validation_rules`

optional additional validators (as defined by `graphql.validation.rules`) to run before attempting to execute the query (the standard validators defined by the GraphQL specification are always used and There's no need to provide them here).


#### `extensions`

List of classes extending [`Extension`](types-reference.md#extension) that will be used during query processing.

> If `extensions` is callable, it should be evaluated on higher level of abstraction (in server integration) before passing to `graphql()`.


#### `error_formatter`

[Error formatter](types-reference.md#errorformatter) that should be used to format errors.

Defaults to [`format_error`](#format_error).


#### `middleware`

Optional middleware to wrap the resolvers with.


- - - - -


## `graphql_sync`

```python
def graphql(schema, data, *, root_value=None, context_value=None, debug=False, validation_rules, error_formatter, middleware, **kwargs)
```

Synchronously executes query against schema.

Returns [`GraphQLResult`](types-reference.md#graphqlresult) instance.

> Use this function instead of [`graphql`](#graphql) to run queries in synchronous servers (WSGI, Django, Flask).


### Required arguments

See [`graphql`](#graphql) required arguments.


### Configuration options

See [`graphql`](#graphql) configuration options

> This function doesn't support `extensions` option.


- - - - -


## `load_schema_from_path`

```python
def load_schema_from_path(path)
```

Loads GraphQL schema from `path` using different strategy depending on `path`'s type:

- If `path` is single file, reads it.
- If `path` is directory, walks it recursively loading all `.graphql` files within it.

Files are validated using the same logic that [`gql`](#gql) uses, concatenated into single string and returned.


- - - - -


## `make_executable_schema`

```python
def make_executable_schema(type_defs, bindables=None)
```

Takes two arguments:

- `type_defs` - string or list of strings with valid GraphQL types definitions.
- `bindables` - [bindable or list of bindables](bindables.md) with Python logic to add to schema. *Optional*.

Returns `GraphQLSchema` instance that can be used to run queries on.


- - - - -


## `resolve_to`

```python
def resolve_to(name)
```

Returns [`default_resolver`](#default_resolver) that always resolves to named attribute. Used to create aliases by [`ObjectType.set_alias`](#set_alias).

- - - - -


## `snake_case_fallback_resolvers`

```python
snake_case_fallback_resolvers
```

[_Bindable_](bindables.md) instace of [`SnakeCaseFallbackResolversSetter`](#snakecasefallbackresolverssetter).


- - - - -


## `subscribe`

```python
async def subscribe(schema, data, *, root_value=None, context_value=None, debug=False, validation_rules, error_formatter, **kwargs)
```

Asynchronously executes subscription query against schema, usually made over the websocket. Takes same arguments and options as [`graphql`](#graphql) except `middleware`.

> This function is an asynchronous coroutine so you will need to `await` on the returned value.

> Coroutines will not work under WSGI. If your server uses WSGI (Django and Flask do), use [`graphql_sync`](#graphql_sync) instead.

> This function doesn't support `extensions` option.


- - - - -


## `upload_scalar`

```python
upload_scalar
```

Instance of [`ScalarType`](#scalartype) that represents uploaded file.

See [file uploads](file-uploads.md) documentation for information about [limitations](file-uploads.md#limitations) and [implementation specific](file-uploads.md#implementation-differences) differences in behaviour.
