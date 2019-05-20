---
id: ariadne-reference
title: Ariadne
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

Valid resolver that is used to resolve the `str` with name of GraphQL type to which `obj` (passed as first argument) belongs to. Receives `GraphQLResolveInfo` instance as second argument.


### Methods

#### `set_type_resolver`

```python
InterfaceType.set_type_resolver(type_resolver)
```

Sets `type_resolver` as type resolver used to resolve the `str` with name of GraphQL type to which `obj` (passed as first argument) belongs to. Receives `GraphQLResolveInfo` instance as second argument.

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

Decorator that takes single parameter, `name` of GraphQL field, and sets decorated callable as resolver for it:

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

Sets `resolver` callable as resolver that will be used to resolve the GraphQL field named `name`.

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


## `SnakeCaseFallbackResolversSetter`

```python
SnakeCaseFallbackResolversSetter()
```

[_Bindable_](bindables.md) used for setting default resolvers on schema object types. Subclasses [`FallbackResolversSetter`](#FallbackResolversSetter) and sets default resolver that performs case conversion between GraphQL's `PascalCase` and Python's `snake_case`:

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

> Like [`QueryType`](#QueryType) and [`MutationType`](#MutationType) this type is hardcoded to bind only to `Subscription` type in schema.


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


### Methods

#### `set_type_resolver`

```python
UnionType.set_type_resolver(type_resolver)
```

Sets `type_resolver` as type resolver used to resolve the `str` with name of GraphQL type to which `obj` (passed as first argument) belongs to. Receives `GraphQLResolveInfo` instance as second argument.

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


## `convert_camel_case_to_snake`


- - - - -


## `default_resolver`


- - - - -


## `fallback_resolvers`


- - - - -


## `format_error`


- - - - -


## `get_error_extension`


- - - - -


## `gql`


- - - - -


## `graphql`


- - - - -


## `graphql_sync`


- - - - -


## `load_schema_from_path`


- - - - -


## `make_executable_schema`


- - - - -


## `resolve_to`


- - - - -


## `snake_case_fallback_resolvers`


- - - - -


## `subscribe`

