---
id: enums
title: Enumeration types
---


Ariadne supports [enumeration types](https://graphql.org/learn/schema/#enumeration-types), which are represented as strings in Python logic:

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
    if status == "ACTIVE":
        return get_users(is_active=True)
    if status == "INACTIVE":
        return get_users(is_active=False)
    if status == "BANNED":
        return get_users(is_banned=True)
```

The above example defines a resolver that returns a list of users based on user status, defined using the `UserStatus` enumerable from the schema.

Implementing logic validating if the `status` value is allowed is not required - this is done by GraphQL. The below query will produce an error:

```graphql
{
    users(status: TEST)
}
```

GraphQL failed to find `TEST` in `UserStatus`, and returned error without calling `resolve_users`:

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

By default enum values are represented as Python strings, but Ariadne also supports mapping GraphQL enums to custom values.

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

In the database, the application may store those weights as integers from 0 to 2. Normally, you would have to implement a custom resolver transforming GraphQL representation to the integer but, like with scalars, you would have to remember to use this boilerplate on every use.

Ariadne provides an `EnumType` utility class thats allows you to delegate this task to GraphQL server:

```python
import enum

from ariadne import EnumType

class PostWeight(enum.IntEnum):
    STANDARD = 1
    PINNED = 2
    PROMOTED = 3

post_weight = EnumType("PostWeight", PostWeight)
```

Include the `post_weight` instance in the list of types passed to your GraphQL server, and it will automatically translate `Enum`s between their GraphQL and Python values.

Instead of `Enum` you may use `dict`:

```python
from ariadne import EnumType

post_weight = EnumType(
    "PostWeight",
    {
        "STANDARD": 1,
        "PINNED": 2,
        "PROMOTED": 3,
    },
)
```

Both `Enum` and `IntEnum` are supported by the `EnumType`.
