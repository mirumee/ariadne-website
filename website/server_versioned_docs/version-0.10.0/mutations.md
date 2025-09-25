---
id: version-0.10.0-mutations
title: Mutations
original_id: mutations
---


All the previous examples in this documentation have dealt with the `Query` root type and reading data. What about creating, updating or deleting data?

Enter the `Mutation` type, `Query`'s sibling that GraphQL servers use to implement functions that change application state.

> Because there is no restriction on what can be done inside resolvers, technically there's nothing stopping somebody from making `Query` fields act as `Mutation`s, taking inputs and executing state-changing logic.
>
> In practice, such queries break the contract with client libraries such as Apollo-Client that do client-side caching and state management, resulting in non-responsive controls or inaccurate information being displayed in the UI as the library displays cached data before redrawing it to display an actual response from the GraphQL.


## Defining mutations

Let's define the basic schema that implements a simple authentication mechanism allowing the client to see if they are authenticated, and to log in and log out:

```python
type_def = """
    type Query {
        isAuthenticated: Boolean!
    }

    type Mutation {
        login(username: String!, password: String!): Boolean!
        logout: Boolean!
    }
"""
```

In this example we have the following elements:

- `Query` type with single field: a boolean for checking if we are authenticated or not. It may appear superficial for the sake of this example, *but Ariadne requires* that your GraphQL API always defines a `Query` type.
- `Mutation` type with two mutations:
    - `login` mutation that requires username and password strings and returns a boolean indicating status.
    - `logout` that takes no arguments and just returns status.


## Writing resolvers

Mutation resolvers are no different than resolvers used by other types. They are functions that take `parent` and `info` arguments, as well as any mutation's arguments as keyword arguments. They then return data that should be sent to the client as a query result:

```python
def resolve_login(_, info, username, password):
    request = info.context["request"]
    user = auth.authenticate(username, password)
    if user:
        auth.login(request, user)
        return True
    return False


def resolve_logout(_, info):
    request = info.context["request"]
    if request.user.is_authenticated:
        auth.logout(request)
        return True
    return False
```

You can map resolvers to mutations using a `MutationType` object:

```python
from ariadne import MutationType
from . import auth_mutations

mutation = MutationType()
mutation.set_field("login", auth_mutations.resolve_login)
mutation.set_field("logout", auth_mutations.resolve_logout)
```

> `MutationType()` is just a shortcut for `ObjectType("Mutation")`.

`MutationType` objects include a `field()` decorator for mapping resolvers to mutations:

```python
mutation = MutationType()

@mutation.field("logout")
def resolve_logout(_, info):
    ...
```

> **Binding Mutation Resolvers**
>
> Recall that all resolvers need to be bound to their respective fields in the schema via the `make_executable_schema` call. If you're following along from the introduction that call will look similar to the following:
>
> ```python
> make_executable_schema(type_defs, [query, mutations])
> ```

## Mutation payloads

The `login` and `logout` mutations introduced earlier in this guide work, but give very limited feedback to the client: they return either `False` or `True`.  The application could use additional information like an error message that could be displayed in the interface if the mutation request fails, or a user state updated after a mutation completed.

In GraphQL this is achieved by making mutations return special *payload* types containing additional information about the result, such as errors or current object state:

```python
type_def = """
    type Mutation {
        login(username: String!, password: String!): LoginPayload
    }

    type LoginPayload {
        status: Boolean!
        error: Error
        user: User
    }
"""
```

The above mutation will return a special type containing information about the mutation's status, as well as either an `Error` message or a logged in `User`. In Python this payload can be represented as a simple `dict`:

```python
def resolve_login(_, info, username, password):
    request = info.context["request"]
    user = auth.authenticate(username, password)
    if user:
        auth.login(request, user)
        return {"status": True, "user": user}
    return {"status": False, "error": "Invalid username or password"}
```

Let's take one more look at the payload's fields:

- `status` makes it easier for the frontend logic to check if mutation succeeded or not.
- `error` contains an error message returned by mutation or `null`. Errors can be simple strings, or more complex types that contain additional information for use by the client.

`user` field is especially noteworthy. Modern GraphQL client libraries like [Apollo Client](https://www.apollographql.com/docs/react/) implement automatic caching and state management, using GraphQL types to track and automatically update stored object data whenever a new one is returned from the API.

Consider a mutation that changes a user's username and its payload:

```graphql
type Mutation {
    updateUsername(id: ID!, username: String!): userMutationPayload
}

type UsernameMutationPayload {
    status: Boolean!
    error: Error
    user: User
}
```

Our client code may first perform an *optimistic update* before the API executes a mutation and returns a response to client. This optimistic update will cause an immediate update of the application interface, making it appear fast and responsive to the user. When the mutation eventually completes a moment later and returns an updated `user` one of two things will happen:

If the mutation succeeded, the user doesn't see another UI update because the new data returned by the mutation was the same as the one set by the optimistic update. If the mutation asked for additional user fields that are dependant on username but weren't set optimistically (like link or user name changes history), those will be updated too.

If the mutation failed, changes performed by an optimistic update are overwritten by valid user state that contains the pre-changed username. The client then uses the `error` field to display an error message in the interface.

For the above reasons it is considered a good design for mutations to return an updated object whenever possible.

> There is no requirement for every mutation to have its own `Payload` type. `login` and `logout` mutations can both define `LoginPayload` as their return type. It is up to the developer to decide how generic or specific mutation payloads should be.


## Inputs

Let's consider the following type:

```graphql
type Discussion {
    category: Category!
    poster: User
    postedOn: Date!
    title: String!
    isAnnouncement: Boolean!
    isClosed: Boolean!
}
```

Imagine a mutation for creating `Discussion`s that takes category, poster, title, announcement and closed states as inputs, and creates a new `Discussion` in the database. Looking at the previous example, we may want to define it like this:

```graphql
type Mutation {
    createDiscussion(
        category: ID!,
        title: String!,
        isAnnouncement: Boolean,
        isClosed: Boolean
    ): DiscussionPayload
}

type DiscussionPayload {
    status: Boolean!
    error: Error
    discussion: Discussion
}
```

Our mutation takes only four arguments, but it is already too unwieldy to work with. Imagine adding another one or two arguments to it in future - it's going to explode!

GraphQL provides a better way for solving this problem: `input` allows us to move arguments into a dedicated type:

```graphql
type Mutation {
    createDiscussion(input: DiscussionInput!): DiscussionPayload
}

input DiscussionInput {
    category: ID!
    title: String!,
    isAnnouncement: Boolean
    isClosed: Boolean
}
```

Now, when a client wants to create a new discussion, it needs to provide an `input` object that matches the `DiscussionInput` definition. This input will then be validated and passed to the mutation's resolver as a `dict` available under the `input` keyword argument:

```python
def resolve_create_discussion(_, info, input):
    clean_input = {
        "category": input["category"],
        "title": input["title"],
        "is_announcement": input.get("isAnnouncement"),
        "is_closed": input.get("isClosed"),
    }

    try:
        return {
            "status": True,
            "discussion": create_new_discussion(info.context, clean_input),
        }
    except ValidationError as err:
        return {
            "status": False,
            "error": err,
        }
```

Another advantage of `input` types is that they are reusable. If we later decide to implement another mutation for updating the `Discussion`, we can do it like this:

```graphql
type Mutation {
    createDiscussion(input: DiscussionInput!): DiscussionPayload
    updateDiscussion(discussion: ID!, input: DiscussionInput!): DiscussionPayload
}

input DiscussionInput {
    category: ID!
    title: String!
    isAnnouncement: Boolean
    isClosed: Boolean
}
```

Our `updateDiscussion` mutation will now accept two arguments: `discussion` and `input`:

```python
def resolve_update_discussion(_, info, discussion, input):
    clean_input = {
        "category": input["category"],
        "title": input["title"],
        "is_announcement": input.get("isAnnouncement"),
        "is_closed": input.get("isClosed"),
    }

    try:
        return {
            "status": True,
            "discussion": update_discussion(info.context, discussion, clean_input),
        }
    except ValidationError as err:
        return {
            "status": False,
            "error": err,
        }
```

You may wonder why you would want to use `input` instead of reusing an already-defined type. This is because input types provide some guarantees that regular objects don't: they are serializable, and they don't implement interfaces or unions. However, input fields are not limited to scalars. You can create fields that are lists, or even reference other inputs:

```graphql
input PollInput {
    question: String!,
    options: [PollOptionInput!]!
}

input PollOptionInput {
    label: String!
    color: String!
}
```

Lastly, take note that inputs are not specific to mutations. You can create inputs to implement complex filtering in your `Query` fields.

> **Note:** you can decorate your resolvers with [`convert_kwargs_to_snake_case`](api-reference.md#convert_kwargs_to_snake_case) to convert arguments and inputs names from `camelCase` to `snake_case`.
