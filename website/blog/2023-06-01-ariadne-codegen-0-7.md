---
title: Ariadne Codegen 0.7
---

Ariadne Codegen 0.7 is now available!

This release brings support for subscriptions, changes how fragments are represented in generated code, introduces `ShorterResultsPlugin` plugin developed by our amazing community and more features and fixes.

<!--truncate-->

## Subscriptions

Version `0.7` introduces support for subscriptions. We generate them as async generators, which means that we don't support subscriptions when generated client is not async (`async_client` is set to `false`).

For example, given following operation:

```gql
subscription GetUsersCounter {
    usersCounter
}
```

Generated client will have following method:

```py
    async def get_users_counter(self) -> AsyncIterator[GetUsersCounter]:
        query = gql(
            """
            subscription GetUsersCounter {
              usersCounter
            }
            """
        )
        variables: dict[str, object] = {}
        async for data in self.execute_ws(query=query, variables=variables):
            yield GetUsersCounter.parse_obj(data)
```

Our default async base client uses [websockets](https://github.com/python-websockets/websockets) package and implements [graphql-transport-ws](https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md) subprotocol.

Required dependencies can by installed with pip:

```
$ pip install ariadne-codegen[subscriptions]
```


## Fragments

In previous versions of Codegen fragments were "unpacked" in queries. For example, given following operations:

```gql
query GetA {
    getTypeA {
        ...FragmentA
    }
}

query ListA {
    listTypeA {
        ...FragmentA
    }
}

fragment FragmentA on TypeA {
    id
    name
}
```

Generated `get_a.py` and `list_a.py` files had types looking like this:

```py
# get_a.py

class GetA(BaseModel):
    get_type_a: "GetAGetTypeA" = Field(alias="GetTypeA")


class GetAGetTypeA(BaseModel):
    id: str
    name: str
```

```py
# list_a.py

class ListA(BaseModel):
    list_type_a: List["ListAListTypeA"] = Field(alias="ListTypeA")


class ListAListTypeA(BaseModel):
    id: str
    name: str
```

Both of these operations use the same `FragmentA` to represnt `TypeA`, but generated models didn't reflect that.

To make working with fragments easier, in Ariadne Codegen 0.7 we are changing this behavior. Instead of unpacking fragments, we generate separate models from them and use those as mixins. Above operation will now result in 3 files being generated: `get_a.py`, `list_a.py` and `fragments.py`

```py
# get_a.py

class GetA(BaseModel):
    get_type_a: "GetAGetTypeA" = Field(alias="GetTypeA")


class GetAGetTypeA(FragmentA):
    pass
```

```py
# list_a.py

class ListA(BaseModel):
    list_type_a: List["ListAListTypeA"] = Field(alias="ListTypeA")


class ListAListTypeA(FragmentA):
    pass
```

```py
# fragments.py

class FragmentA(BaseModel):
    id: str
    name: str
```

With this change you can use fragments as reusable types in your Python logic using the client, eg. `def process_a(a: FragmentA)...`. New `fragments.py` consists fragments collected from all parsed operations.


### Unions and Interfaces

There is an exception from new fragments behaviour. If fragment represents `Union` then we unpack it as before:

```gql
query getAnimal {
    animal {
        ...AnimalData
    }
}

fragment AnimalData on AnimalInterface {
    name
    ... on Dog {
        dogField
    }
    ... on Cat {
        catField
    }
}
```

For above fragment this Python code will be generated:

```py
class GetAnimal(BaseModel):
    animal: Union[
        "GetAnimalAnimalAnimalInterface", "GetAnimalAnimalDog", "GetAnimalAnimalCat"
    ] = Field(discriminator="typename__")


class GetAnimalAnimalAnimalInterface(BaseModel):
    typename__: Literal["AnimalInterface", "Fish"] = Field(alias="__typename")
    name: str


class GetAnimalAnimalDog(BaseModel):
    typename__: Literal["Dog"] = Field(alias="__typename")
    name: str
    dog_field: str = Field(alias="dogField")


class GetAnimalAnimalCat(BaseModel):
    typename__: Literal["Cat"] = Field(alias="__typename")
    name: str
    cat_field: str = Field(alias="catField")
```


## `ShorterResultsPlugin`

In version 0.7 we are including `ShorterResultsPlugin` developed by our community. It can be used when operations have only one top level field. For example, given following operation:

```gql
query GetUser($userId: ID!) {
    user(id: $userId) {
        id
    }
}
```

From this operation, generated method looks like this:

```py
async def get_user(self, user_id: str) -> GetUser:
    query = gql(
        """
        query GetUser($userId: ID!) {
            user(id: $userId) {
                id
            }
        }
        """
    )
    variables: dict[str, object] = {"userId": user_id}
    response = await self.execute(query=query, variables=variables)
    data = self.get_data(response)
    return GetUser.parse_obj(data)
```

To get value of `user`, we need to always get it by attribute, eg. `await get_user("1").user`. By using `ShorterResultsPlugin` our `get_user` returns value of `user` directly.
```toml
[tool.ariadne-codegen]
...
plugins = ["ariadne_codegen.contrib.shorter_results.ShorterResultsPlugin"]
```

```py
async def get_user(self, user_id: str) -> GetUserUser:
    ...
    return GetUser.parse_obj(data).user

```


## Discriminated unions 

To ensure that data is represented as correct class we use pydantic's [discriminated unions](https://docs.pydantic.dev/dev-v2/usage/types/unions/#discriminated-unions-aka-tagged-unions). We add `__typename` to queries with unions and then use it's value as `discriminator`. Let's take example schema and query:

```gql
type Query {
  animal: Animal!
}

interface Animal {
  name: String!
}

type Dog implements Animal {
  name: String!
  dogField: String!
}

type Cat implements Animal {
  name: String!
  catField: String!
}

type Fish implements Animal {
  name: String!
}
```

```gql
query GetAnimal {
    animal {
        name
        ... on Dog {
            dogField
        }
        ... on Cat {
            catField
        }
    }
}
```

From this query and operation we generate following types:

```py
class GetAnimal(BaseModel):
    animal: Union[
        "GetAnimalAnimalAnimal", "GetAnimalAnimalDog", "GetAnimalAnimalCat"
    ] = Field(discriminator="typename__")


class GetAnimalAnimalAnimal(BaseModel):
    typename__: Literal["Animal", "Fish"] = Field(alias="__typename")
    name: str


class GetAnimalAnimalDog(BaseModel):
    typename__: Literal["Dog"] = Field(alias="__typename")
    name: str
    dog_field: str = Field(alias="dogField")


class GetAnimalAnimalCat(BaseModel):
    typename__: Literal["Cat"] = Field(alias="__typename")
    name: str
    cat_field: str = Field(alias="catField")
```

We added `typename__` to this query, and by it's value pydantic determines which model to chose.


## Leading underscores

Ariadne Codegen 0.7 will remove leading `_` from field names. Fields with `_` are ignored by pydantic and it was impossible to save value of such fields.


## Removal of `mixin` directive from operation sent to server

We support custom `mixin` directive, which allows extending of generated types. In 0.7 we are removing it from operation string included in generated client's methods. This directive is only used in process of generation and caused servers to return error becouse of of unknown directive.


## `process_schema` plugin hook

Plugins can now define `process_schema` hook to change schema before Codegen uses it for generation. From now we allow invalid schemas to be parsed from files or url, and then we call this plugin hook. After `process_schema` is finished processed schema must pass `graphql.assert_valid_schema` validation.

For example it can be used to add Apollo Federation directives definitions:

```py
class MyPlugin:
    def process_schema(self, schema: GraphQLSchema) -> GraphQLSchema:
        extends_directive_def = GraphQLDirective(...)
        schema.directives += (extends_directive_def, )

        return schema
```


## Changelog

- Added support for subscriptions as async generators.
- Changed how fragments are handled to generate separate module with fragments as mixins.
- Fixed `ResultTypesGenerator` to trigger `generate_result_class` for each result model.
- Changed processing of models fields to trim leading underscores.
- Added `ShorterResultsPlugin` to standard plugins.
- Fixed handling of inline fragments inside other fragments.
- Changed generated unions to use pydantic's discriminated unions feature.
- Replaced HTTPX's `json=` serializer for query payloads with pydantic's `pydantic_encoder`.
- Removed `mixin` directive from operation string sent to server.
- Fixed `ShorterResultsPlugin` that generated faulty code for discriminated unions.
- Changed generator to ignore unused fragments which should be unpacked in queries.
- Changed type hints for parse and serialize methods of scalars to `typing.Any`.
- Added `process_schema` plugin hook.
