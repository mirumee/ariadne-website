---
id: version-0.16-api-reference
title: API reference
sidebar_label: ariadne
original_id: api-reference
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

> This is an convenience utility that can be used in place of `ObjectType("Mutation")`.


- - - - -


## `ObjectType`

```python
ObjectType(name)
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

> This is an convenience utility that can be used in place of `ObjectType("Query")`.


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


@date_scalar.serializer
def serialize_datetime(value):
    return value.isoformat()


@date_scalar.value_parser
def serialize_datetime(value):
    return date.strptime(value, "%Y-%m-%d")
```


- - - - -


## `SchemaDirectiveVisitor`

```python
SchemaDirectiveVisitor()
```

Base class for implementing [schema directives](schema-directives.md).


### Attributes

#### `args`

`dict` with arguments passed to the directive.


#### `name`

`str` with name of the directive in the schema.


#### `schema`

Instance of the `GraphQLSchema`, in which this directive is used.


### Methods

#### `visit_argument_definition`

```python
SchemaDirectiveVisitor.visit_argument_definition(argument, field, object_type)
```

Called during the executable schema creation for directives supporting the `ARGUMENT_DEFINITION` location set on schema fields arguments:

```graphql
directive @example on ARGUMENT_DEFINITION

type Mutation {
    rotateToken(token: String @example): String
}
```

Takes following arguments:

- `argument` - an instance of the `GraphQLArgument`.
- `field` -  an instance of the `GraphQLField`.
- `object_type` - an instance of the `GraphQLObjectType` or `GraphQLInterfaceType`.

Must return an instance of the `GraphQLArgument`.


#### `visit_enum`

```python
SchemaDirectiveVisitor.visit_enum(enum)
```

Called during the executable schema creation for directives supporting the `ENUM` location set on enums:

```graphql
directive @example on ENUM

enum ErrorType @example {
    NOT_FOUND
    PERMISSION_DENIED
    EXPIRED
}
```

Takes single argument, an instance `GraphQLEnumType`.

Must return an instance of the `GraphQLEnumType`.


#### `visit_enum_value`

```python
SchemaDirectiveVisitor.visit_enum_value(value, enum_type)
```

Called during the executable schema creation for directives supporting the `ENUM_VALUE` location set on enum values:

```graphql
directive @example on ENUM

enum ErrorType {
    NOT_FOUND
    PERMISSION_DENIED @example
    EXPIRED
}
```

Takes two arguments:

- `value` - an instance the `GraphQLEnumValue`.
- `enum_type` - instance of the `GraphQLEnumType` to which this value belongs.

Must return an instance of the `GraphQLEnumValue`.


#### `visit_field_definition`

```python
SchemaDirectiveVisitor.visit_field_definition(field, object_type)
```

Called during the executable schema creation for directives supporting the `FIELD_DEFINITION` location set on objects and interfaces fields:

```graphql
directive @example on FIELD_DEFINITION

type User {
    id: ID
    username: String @example
}

interface Searchable {
    document: String @example
}
```

Takes two arguments:

- `field` - an instance the `GraphQLField`.
- `object_type` - an instance of the `GraphQLObjectType` or `GraphQLInterfaceType` to which this field belongs.

Must return an instance of the `GraphQLField`.


#### `visit_input_field_definition`

```python
SchemaDirectiveVisitor.visit_input_field_definition(field, object_type)
```

Called during the executable schema creation for directives supporting the `INPUT_FIELD_DEFINITION` location set on inputs fields:

```graphql
directive @example on INPUT_FIELD_DEFINITION

input UserInput {
    username: String @example
    email: String
}
```

Takes two arguments:

- `field` - an instance the `GraphQLInputField`.
- `object_type` - an instance of the `GraphQLInputObjectType` to which this field belongs.

Must return an instance of the `GraphQLInputField`.


#### `visit_input_object`

```python
SchemaDirectiveVisitor.visit_input_object(object_)
```

Called during the executable schema creation for directives supporting the `INPUT_OBJECT` location set on input types:

```graphql
directive @example on INPUT_OBJECT

input UserInput @example {
    username: String
    email: String
}
```

Takes single argument, an instance `GraphQLInputObjectType`.

Must return an instance of the `GraphQLInputObjectType`.


#### `visit_interface`

```python
SchemaDirectiveVisitor.visit_interface(interface)
```

Called during the executable schema creation for directives supporting the `INTERFACE` location set on interfaces:

```graphql
directive @example on INTERFACE

interface Searchable @example {
    document: String
}
```

Takes single argument, an instance `GraphQLInterfaceType`.

Must return an instance of the `GraphQLInterfaceType`.


#### `visit_object`

```python
SchemaDirectiveVisitor.visit_object(object_)
```

Called during the executable schema creation for directives supporting the `OBJECT` location set on objects:

```graphql
directive @example on OBJECT

type User @example {
    id: ID
    username: String
}
```

Takes single argument, an instance `GraphQLObjectType`.

Must return an instance of the `GraphQLObjectType`.


#### `visit_scalar`

```python
SchemaDirectiveVisitor.visit_scalar(scalar)
```

Called during the executable schema creation for directives supporting the `SCALAR` location set on scalars:

```graphql
directive @example on SCALAR

scalar Datetime @example
```

Takes single argument, an instance `GraphQLScalarType`.

Must return an instance of the `GraphQLScalarType`.


#### `visit_schema`

```python
SchemaDirectiveVisitor.visit_schema(schema)
```

Called during the executable schema creation for directives supporting the `SCHEMA` location set on schema:

```graphql
directive @example on SCHEMA

schema @example {
    query: Query
}
```

Takes single argument, an instance of current `GraphQLSchema`. Should mutate this instance in place - returning anything from this method causes an `ValueError` to be raised.


#### `visit_union`

```python
SchemaDirectiveVisitor.visit_union(union)
```

Called during the executable schema creation for directives supporting the `UNION` location set on unions:

```graphql
directive @example on UNION

union SearchResult = User | Thread @example
```

Takes single argument, an instance `GraphQLUnionType`.

Must return an instance of the `GraphQLUnionType`.


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


## `convert_kwargs_to_snake_case`

```python
@convert_kwargs_to_snake_case
```

Decorator for [`Resolver`](types-reference.md#resolver) that recursively converts arguments case from `camelCase` to `snake_case`.


### Example

`user` field in schema defines `firstName` and `lastName` arguments which are converted by the decorator to `first_name` and `last_name` before being passed to the resolver:

```
from ariadne import QueryType, convert_kwargs_to_snake_case

query = QueryType()

type_defs = """
  type Query {
    user(firstName: String, lastName: String): User
  }
"""


@query.field("user")
@convert_kwargs_to_snake_case
def resolve_user(*_, first_name=None, last_name=None):
    ...
```


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

[_Bindable_](bindables.md) instance of [`FallbackResolversSetter`](#fallbackresolverssetter).


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


## `get_formatted_error_context`

```python
def get_formatted_error_context(error)
```

Takes exception instance as only argument and returns context values for it that are JSON-serializeable and can be included in the error result JSON.

Used by `get_error_extension` to include `context` in the `exception` JSON that Ariadne's default error formatter returns in debug mode.


- - - - -


## `get_formatted_error_traceback`

```python
def get_formatted_error_traceback(error)
```

Takes exception instance as only argument and returns traceback (stacktrace) for it that is JSON-serializeable and can be included in the error result JSON.

Used by `get_error_extension` to include `stacktrace` in the `exception` JSON that Ariadne's default error formatter returns in debug mode.


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
async def graphql(
    schema,
    data,
    *,
    root_value=None,
    context_value=None,
    logger=None,
    debug=False,
    introspection=True,
    validation_rules,
    error_formatter,
    extensions=None,
    middleware,
    **kwargs
)
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


#### `introspection`

If `False` will prevent clients from introspecting the schema, returning an error when any of introspection fields such as `__schema` are queried.

Disabling introspection will also disable the GraphQL Playground, resulting in error 405 "method not allowed" being returned for GET requests.


#### `validation_rules`

optional additional validators (as defined by `graphql.validation.rules`) to run before attempting to execute the query (the standard validators defined by the GraphQL specification are always used and There's no need to provide them here).


#### `extensions`

List of classes extending [`Extension`](types-reference.md#extension) that will be used during query processing.

> If `extensions` is callable, it should be evaluated on higher level of abstraction (in server integration) before passing to `graphql()`.


#### `error_formatter`

[Error formatter](types-reference.md#errorformatter) that should be used to format errors.

Defaults to [`format_error`](#format_error).


#### `middleware`

List of middleware that should be used during the query execution.


- - - - -


## `graphql_sync`

```python
def graphql(
    schema,
    data,
    *,
    root_value=None,
    context_value=None,
    debug=False,
    introspection=True,
    validation_rules,
    error_formatter,
    middleware,
    **kwargs
)
```

Synchronously executes query against schema.

Returns [`GraphQLResult`](types-reference.md#graphqlresult) instance.

> Use this function instead of [`graphql`](#graphql) to run queries in synchronous servers (WSGI, Django, Flask).


### Required arguments

See [`graphql`](#graphql) required arguments.


### Configuration options

See [`graphql`](#graphql) configuration options


- - - - -


## `load_schema_from_path`

```python
def load_schema_from_path(path)
```

Loads GraphQL schema from `path` using different strategy depending on `path`'s type:

- If `path` is single file, reads it.
- If `path` is directory, walks it recursively loading all `.graphql`, `.graphqls`, and `.gql` files within it.

Files are validated using the same logic that [`gql`](#gql) uses, concatenated into single string and returned.

Raises [`GraphQLFileSyntaxError`](exceptions-reference.md#graphqlfilesyntaxerror) if any of the loaded files contained syntax errors.


- - - - -


## `make_executable_schema`

```python
def make_executable_schema(type_defs, *bindables, directives=None)
```

Construct executable schema - GraphQL schema against which queries can be executed.

Returns `GraphQLSchema` instance that can be used to run queries on.


### Required arguments

#### `type_defs`

string or list of strings with valid GraphQL types definitions.


### Optional arguments

#### `bindables`

[Bindable or list of bindables](bindables.md) with Python logic to add to schema:

```python
type_defs = ...  # valid type defs string

# Bindables can be passed as *args
schema = make_executable_schema(type_defs, query, user, datetime_scalar)

# ...or as list of types...
schema = make_executable_schema(type_defs, [query, user, datetime_scalar])

# ...or mixed!
third_party_bindables = [likes, likes_stats]
schema = make_executable_schema(type_defs, query, user, datetime_scalar, third_party_bindables)
```

> **Note**
>
> Passing bindables as list is supported for backwards-compatibility with Ariadne versions pre-0.8, and will be removed in future version of Ariadne. To future-proof your code, unpack lists of bindables using explicit syntax:
>
> ```python
> schema = make_executable_schema(type_defs, query, user, datetime_scalar, *third_party_bindables)
> ```


### Configuration options

#### `directives`

`dict` that maps schema directives to their Python implementations. See [schema directives documentation](schema-directives.md) for more information and examples.


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

[_Bindable_](bindables.md) instance of [`SnakeCaseFallbackResolversSetter`](#snakecasefallbackresolverssetter).


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


## `unwrap_graphql_error`

```python
def unwrap_graphql_error(error)
```

Unwraps `GraphQLError` recursively, returning its `original_error` attribute value until non-`GraphQLError` instance is found, or `original_error` attribute has no value.


- - - - -


## `upload_scalar`

```python
upload_scalar
```

Instance of [`ScalarType`](#scalartype) that represents uploaded file.

See [file uploads](file-uploads.md) documentation for information about [limitations](file-uploads.md#limitations) and [implementation specific](file-uploads.md#implementation-differences) differences in behaviour.
