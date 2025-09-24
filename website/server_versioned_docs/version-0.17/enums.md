---
id: enums
title: Enumeration types
---


Ariadne supports GraphQL [enumeration types](https://graphql.org/learn/schema/#enumeration-types) which by default are represented as strings in Python logic:

```python
from ariadne import QueryType
from db import get_users

type_defs = """
    type Query{
        users(status: UserStatus): [User]!
    }

    enum UserStatus{
        ACTIVE
        INACTIVE
        BANNED
    }
"""

query = QueryType()

@query.field("users")
def resolve_users(*_, status):
    # Value of UserStatus passed to resolver is represented as Python string
    if status == "ACTIVE":
        return get_users(is_active=True)
    if status == "INACTIVE":
        return get_users(is_active=False)
    if status == "BANNED":
        return get_users(is_banned=True)
```

The above example defines a resolver that returns a list of users based on user status, defined using the `UserStatus` enumerable from the schema.

There is no need for resolver to validate if `status` value belongs to the enum. This is done by GraphQL during query execution. Below query will produce an error:

```graphql
{
    users(status: TEST)
}
```

GraphQL failed to find `TEST` in `UserStatus`, and returned an error without calling `resolve_users`:

```json
{
    "error": {
        "errors": [
            {
                "message": "Argument \"status\" has invalid value TEST.\nExpected type \"UserStatus\", found TEST.",
                "locations": [
                    {
                        "line": 2,
                        "column": 14
                    }
                ]
            }
        ]
    }
}
```


## Mapping to internal values

By default enum values are represented as Python strings, but Ariadne also supports mapping GraphQL enums to custom Python values.

Imagine posts on a social site that can have weights like "standard", "pinned" and "promoted":

```graphql
type Post {
    weight: PostWeight
}

enum PostWeight {
    STANDARD
    PINNED
    PROMOTED
}
```

In the database, the application may store those weights as integers from 0 to 2. Normally, you would have to implement a custom resolver transforming GraphQL representation to the integer but, you would have to remember to use this boilerplate in every resolver.

Ariadne provides an `EnumType` utility thats allows you to delegate this task to GraphQL server:

```python
import enum

from ariadne import EnumType

class PostWeight(enum.IntEnum):
    STANDARD = 0
    PINNED = 1
    PROMOTED = 2

post_weight = EnumType("PostWeight", PostWeight)
```

Include the `post_weight` instance in the list of types passed to `make_executable_schema`:

```python
schema = make_executable_schema(type_defs, some_type, post_weight)
```

This will make the GraphQL server automatically translate `PostWeight` between their GraphQL and Python values:

- If `PostWeight` enum's value is passed in argument of GraphQL field, Python resolver will be called with `PostWeight` member, like `PostWeight.PINNED`.
- If Python resolver for field returning GraphQL enum returns Enum member this value will be converted into GraphQL enum. Eg. returning `PostWeight.PROMOTED` from resolver will appear as `"PROMOTED"` in GraphQL result).
- If Python resolver for field returning GraphQL enum returns a value that's valid value of enum's member, this value will be converted into enum. Eg. returning `1` from resolver will appear as `"PINNED"` in GraphQL result).

Instead of `Enum` you may use plain `dict`:

```python
from ariadne import EnumType

post_weight = EnumType(
    "PostWeight",
    {
        "STANDARD": 0,
        "PINNED": 1,
        "PROMOTED": 2,
    },
)
```

Both `Enum` and `IntEnum` are supported by the `EnumType`.
