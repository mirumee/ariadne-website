---
title: Introducing Ariadne GraphQL Modules
---

[Ariadne GraphQL Modules library is now available](https://github.com/mirumee/ariadne-graphql-modules) 🎉 

This library provides developers with modular way for implementing GraphQL schemas in their projects.

<!--truncate-->

## Example

In Ariadne GraphQL Modules, every GraphQL type is defined as Python type:

```python
from ariadne_graphql_modules import ObjectType, gql


class UserType(ObjectType):
    __schema__ = gql(
        """
        type User {
            id: ID!
            name: String!
            email: String
        }
        """
    )

    @staticmethod
    def resolve_email(user, info):
        if info.context["user"] == user or info.context["is_admin"]:
            return user.email

        return None
```

Types can depend on other types:

```python
from ariadne_graphql_modules import ObjectType, gql
from my_app.users.models import User


class UsersQueries(ObjectType):
    __schema__ = gql(
        """
        type Query {
            user(id: ID!): User
            lastUsers: [User!]!
        }
        """
    )
    __aliases__ = {"lastUsers": "last_users"}
    __requires__ = [UserType]  # UsersQueries requires User definition

    @staticmethod
    async def resolver_user(*_, id):
        return await User.objects.filter(id=id).one()

    @staticmethod
    async def resolve_last_users(*_):
        return await User.objects.order_by("-id").limit(10)
```

Types are then passed to `make_executable_schema` which flattens types graph, and produces executable `GraphQL` schema instance:

```python
from ariadne.asgi import GraphQL
from ariadne_graphql_modules import make_executable_schema
from my_app.users.graphql import UsersQueries

schema = make_executable_schema(UsersQueries)
app = GraphQL(schema)
```

## Automatic merging of multiple roots

`make_executable_schema` by default merges multiple `Query`, `Mutation` and `Subscription` types into one, so you don't have to define "throwaway" type with single unused field to extend in other places:

```python
from datetime import date

from ariadne.asgi import GraphQL
from ariadne_graphql_modules import ObjectType, gql, make_executable_schema


class YearQuery(ObjectType):
    __schema__ = gql(
        """
        type Query {
            year: Int!
        }
        """
    )

    @staticmethod
    def resolve_year(*_):
        return date.today().year


class MessageQuery(ObjectType):
    __schema__ = gql(
        """
        type Query {
            message: String!
        }
        """
    )

    @staticmethod
    def resolve_message(*_):
        return "Hello world!"


schema = make_executable_schema(YearQuery, MessageQuery)
app = GraphQL(schema=schema, debug=True)
```

Final schema will contain single `Query` type thats result of merged tupes:

```graphql
type Query {
    message: String!
    year: Int!
}
```

Fields on final type will be ordered alphabetically.


## Better case mapping between `clientWorld` and `python_world`

Above example contained explicit mapping of `lastUsers` field in GraphQL schema to `last_users` Python name using the `__aliases__` option.

Library also provides `convert_case` utility that performs this conversion automatically for given type:

```python
from ariadne_graphql_modules import ObjectType, convert_case


class UsersQueries(ObjectType):
    __schema__ = gql(
        """
        type Query {
            user(id: ID!): User
            lastUsers: [User!]!
        }
        """
    )
    __aliases__ = convert_case
    __requires__ = [UserType]  # UsersQueries requires User definition
```

This utility also handles mapping of arguments names:

```python
class UserRegisterMutation(MutationType):
    __schema__ = gql(
        """
        type Mutation {
            registerUser(fullName: String!, email: String!): Boolean!
        }
        """
    )
    __fields_args__ = convert_case

    @staticmethod
    async def resolve_mutation(*_, full_name: str, email: str):
        user = await create_user(
            full_name=full_name,
            email=email,
        )
        return bool(user)
```

It also takes care of input fields:

```python
class UserRegisterInput(InputType):
    __schema__ = gql(
        """
        input UserRegisterInput {
            fullName: String!
            email: String!
        }
        """
    )
    __args__ = convert_case


class UserRegisterMutation(MutationType):
    __schema__ = gql(
        """
        type Mutation {
            registerUser(input: UserRegisterInput!): Boolean!
        }
        """
    )
    __requires__ = [UserRegisterInput]

    @staticmethod
    async def resolve_mutation(*_, input: dict):
        user = await create_user(
            full_name=input["full_name"],
            email=input["email"],
        )
        return bool(user)
```


## Installation

Ariadne GraphQL Modules can be installed with pip:

```console
pip install ariadne-graphql-modules
```

> Ariadne 0.15 or later is required.


## Using modules in your project

Because there's no way to mix old and new approach within single GraphQL API we are recommending this library for teams starting new schemas or maintaining smaller existing schemas and are unhappy with "default" approach for schema definition that Ariadne provides. Just remember that we **don't consider current API stable** and we plan to iterate and change things based on our own experience with it and feedback from other users.

We don't know yet if in future we will merge modules code into Ariadne proper. For the time being we want to maintain it as a separate library so we can make frequent releases as bugs are discovered and improvements are found.


## Feedback

We'd **LOVE** to hear what you think about Ariadne GraphQL Modules. You can let us know using [Ariadne's discussions on GitHub](https://github.com/mirumee/ariadne/discussions).