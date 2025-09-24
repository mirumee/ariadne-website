---
title: Ariadne Codegen 0.9
---

Ariadne Codegen 0.9 is now available!

This release includes a number of fixes and improvements related to Pydantic v2.

<!--truncate-->

## Custom scalars

In the last refactoring of custom scalars, we introduced a bug that caused custom `parse` to be called on already correct objects within generated input models. To fix this, we are again changing the way custom scalars are represented in the generated package. We are removing `scalars.py`, the related option and plugin hooks. Instead, scalars will be represented directly as provided types.

### Custom scalar without custom parse and serialize

```toml
[tool.ariadne-codegen.scalars.SCALARA]
type = "str"
```

Each occurrence of `SCALARA` is represented as `str`.

```toml
[tool.ariadne-codegen.scalars.DATETIME]
type = "datetime.datetime"
```

In this case, `DATETIME` is treated in the same way, but the necessary import is added: `from datetime import datetime`.

### Custom scalar with custom parse and serialize

```toml
[tool.ariadne-codegen]
...
files_to_include = [".../type_b.py"]

[tool.ariadne-codegen.scalars.SCALARB]
type = ".type_b.TypeB"
parse = ".type_b.parse_b"
serialize = ".type_b.serialize_b"
```

`SCALARB` is represented as `TypeB`, but annotated according to its specific usage.

In models representing input types it will be annotated with `PlainSerializer`. This allows the user to create an input model with an existing `TypeB` instance, and serialization will take place automatically during query execution.

```py
# inputs.py

class TestInput(BaseModel):
    value_b: Annotated[TypeB, PlainSerializer(serialize_b)]
```

```py
b = TypeB(...)
test_input = TestInput(value_b=b)
```

In result models `TypeB` will be annotated with `BeforeValidator`, which will use `parse_b` to deserialize `TypeB`\`s data from the server.

```py
# get_b.py

class GetB(BaseModel):
    query_b: Annotated[TypeB, BeforeValidator(parse_b)]
```

```py
async with Client(...) as client:
    b_data = await client.get_b()

assert isinstance(b_data.query_b, TypeB)
```

If `SCALARB` is used as the type of the operation argument, it will be represented as an unannotated `TypeB`, but `serialize_b` will still be used in `variables` dict.

```py
# client.py

class Client(AsyncBaseClient):
    async def test_mutation(self, value: TypeB) -> TestMutation:
        ...
        variables: Dict[str, object] = {
            "value": serialize_b(value),
        }
        ...
```

## Pydantic\`s warnings

By default, Pydantic gives a warning if the name of a field starts with `model_`, but throws an error if there is a collision with an existing attribute. In the last release we took care of the collisions and now we are changing the configuration of `BaseModel` to not give these warnings.

## Nullable directives

Codegen detects `@skip' and `@include' directives and marks fields with them as `Optional`, even if the type is not nullable. With pydantic v1 this worked fine, but with v2 there is an error if the response does not include a key for such a field. To maintain previous functionality, we will add an explicit `None` default for fields with one of these directives.

## Operation string with nested inline fragments

Version `0.9` fixes the way we generate the operation string for the case where fragments are only used within an inline fragment. From now on we include these nested fragments.

## Changelog

- Fixed generating operation string for nested inline fragments.
- Removed scalars module. Changed generated models and client to use annotated types for custom scalars. Removed `scalars_module_name` option. Removed `generate_scalars_module`, `generate_scalars_cod`, `generate_scalar_annotation` and `generate_scalar_imports` plugin hooks.
- Removed pydantic warnings for fields with `model_` prefix.
- Fixed generating result types with nullable directives.
