---
id: version-0.11.0-scalars
title: Custom scalars
original_id: scalars
---


Custom scalars allow you to convert your Python objects to a JSON-serializable form in query results, as well as convert those JSON forms back to Python objects when they are passed as arguments or `input` values.


## Example read-only scalar

Consider this API defining a `Story` type with a `publishedOn` field:

```graphql
type Story {
    content: String
    publishedOn: String
}
```

The `publishedOn` field resolver returns an instance of type `datetime`, but in the API this field is defined as `String`. This means that our datetime will be passed through the `str()` function before being returned to the client:

```json
{
    "publishedOn": "2018-10-26 17:28:54.416434"
}
```

This may look acceptable, but there are better formats to serialize timestamps for later deserialization on the client, like ISO 8601. This conversion could be performed in a dedicated resolver:

```python
def resolve_published_on(obj, *_):
    return obj.published_on.isoformat()
```

However, the developer now has to remember to define a custom resolver for every field that returns `datetime`. This really adds boilerplate to the API, and makes it harder to use abstractions auto-generating the resolvers for you.

Instead, GraphQL API can be told how to serialize dates by defining the custom scalar type:

```graphql
type Story {
    content: String
    publishedOn: Datetime
}

scalar Datetime
```

If you try to query this field now, you will get an error:

```json
{
    "error": "Unexpected token A in JSON at position 0"
}
```

This is because a custom scalar has been defined, but it's currently missing logic for serializing Python values to JSON form and `Datetime` instances are not JSON serializable by default.

We need to add a special serializing resolver to our `Datetime` scalar that will implement the logic we are expecting. Ariadne provides the `ScalarType` class that enables just that:

```python
from ariadne import ScalarType

datetime_scalar = ScalarType("Datetime")

@datetime_scalar.serializer
def serialize_datetime(value):
    return value.isoformat()
```

Include the `datetime_scalar` in the list of `resolvers` passed to your GraphQL server. Custom serialization logic will now be used when a resolver for the `Datetime` field returns a value other than `None`:

```json
{
    "publishedOn": "2018-10-26T17:45:08.805278"
}
```

We can now reuse our custom scalar across the API to serialize `datetime` instances in a standardized format that our clients will understand.


## Scalars as input

What will happen if now we create a field or mutation that defines an argument of the type `Datetime`? We can find out using a basic resolver:

```graphql
type Query {
    stories(publishedOn: Datetime): [Story!]!
}
```

```python
def resolve_stories(*_, **data):
    print(data.get("publishedOn"))  # what value will "publishedOn" be?
```

`data.get("publishedOn")` will print whatever value was passed to the argument, coerced to the respective Python type. For some scalars this may do the trick, but for this one it's expected that input gets converted back to the `datetime` instance.

To turn our *read-only* scalar into *bidirectional* scalar, we will need to add two functions to the `ScalarType` that was created in the previous step:

- `value_parser(value)` that will be used when the scalar value is passed as part of query `variables`.
- `literal_parser(ast)` that will be used when the scalar value is passed as part of query content (e.g. `{ stories(publishedOn: "2018-10-26T17:45:08.805278") { ... } }`).

Those functions can be implemented as such:

```python
@datetime_scalar.value_parser
def parse_datetime_value(value):
    # dateutil is provided by python-dateutil library
    if value:
        return dateutil.parser.parse(value)

@datetime_scalar.literal_parser
def parse_datetime_literal(ast):
    value = str(ast.value)
    return parse_datetime_value(value)  # reuse logic from parse_value
```

There are a few things happening in the above code, so let's go through it step by step:

If the `value` is passed as part of a query's `variables`, it's passed to `parse_datetime_value`.

If the `value` is not empty, `dateutil.parser.parse` is used to parse it to the valid Python `datetime` object instance that is then returned.

If `value` is incorrect and either a `ValueError` or `TypeError` exception is raised by the `dateutil.parser.parse`, the GraphQL server interprets this as a sign that the entered value is incorrect because it can't be transformed to an internal representation and returns an automatically generated error message to the client that consists of two parts:

- A message from GraphQL: `Expected type Datetime!, found "invalid string"`
- The internal exception message: `time data 'invalid string' does not match format '%Y-%m-%d'`

The complete error message returned by the API will look like this: 

```
Expected type Datetime!, found "invalid string"; time data 'invalid string' does not match format '%Y-%m-%d'
```

> You can raise either `ValueError` or `TypeError` in your parsers.

> Because the error message returned by the GraphQL server includes the original exception message from your Python code, it may contain details specific to your system or implementation that you may not want to make known to the API consumers. You may decide to catch the original exception with `except (ValueError, TypeError)` and then raise your own `ValueError` with a custom message (or no message at all) to prevent this from happening.

If a value is specified as part of query content, its `ast` node is instead passed to `parse_datetime_literal` to give the scalar a chance to introspect the type of the node (implementations for those be found [here](https://github.com/graphql-python/graphql-core/blob/v3.0.3/src/graphql/language/ast.py#L344)).

Logic implemented in the `parse_datetime_literal` may be completely different from that in the `parse_datetime_value`, however, in this example the `ast` node is simply unpacked, coerced to `str` and then passed to `parse_datetime_value`, reusing the parsing logic.

> Defining a `literal_parser` that only calls `value_parser` with `ast.value` is optional. Ariadne will create one for you when you set the scalar's value parser and there's no literal parser already set.


## Configuration reference

In addition to the decorators documented above, `ScalarType` provides two more ways for configuring its logic.

You can pass your functions as values to `serializer`, `value_parser` and `literal_parser` keyword arguments on instantiation:

```python
from ariadne import ScalarType
from thirdpartylib import json_serialize_money, json_deserialize_money

money = ScalarType("Money", serializer=json_serialize_money, value_parser=json_deserialize_money)
```

Alternatively you can use `set_serializer`, `set_value_parser` and `set_literal_parser` setters:

```python
from ariadne import ScalarType
from thirdpartylib import json_serialize_money, json_deserialize_money

money = ScalarType("Money")
money.set_serializer(json_serialize_money)
money.set_value_parser(json_deserialize_money)
money.set_literal_parser(json_deserialize_money)
```
