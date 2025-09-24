---
title: Ariadne Codegen 0.8
---

Ariadne Codegen 0.8 has been released!

This release brings support for file uploads, pydantic v2 compliance, improved custom scalars handling, and few other features and fixes.

<!--truncate-->

## File uploads

From now on, the default base client (sync or async) checks if any part of `variables` is an instance of `Upload`. If such an instance is found, the client sends a multipart request according to [GraphQL multipart request specification](https://github.com/jaydenseric/graphql-multipart-request-spec). `Upload` is a class that stores necessary data about the file:

```python
class Upload:
    def __init__(self, filename: str, content: IOBase, content_type: str):
        self.filename = filename
        self.content = content
        self.content_type = content_type
```

It is part of the generated client, and can be imported from it:

```python
from {target_package_name} import Upload
```

By default, this class represents the graphql scalar `Upload`, but using custom scalar configuration, it can also be used for other scalars, e.g:

```toml
[tool.ariadne-codegen.scalars.OTHERSCALAR]
type = "Upload"
```

## Pydantic v2

Version `0.8` changes the supported version of `pydantic` to `>=2.0.0,<3.0.0`. List of changes in the generated client:

- Renamed `parse_obj` to `model_validate`.
- Renamed `dict` to `model_dump`.
- Preconfigured `BaseModel` uses `model_config` attribute instead of `Config` class.
- Renamed `update_forward_refs` to `model_rebuild`.
- Changed json encoder used by default base clients from `pydantic.json.pydantic_encoder` to `pydantic_core.to_jsonable_python`.
- Optional input fields now have an explicit default `None` value (if the schema doesn't specify another value).

## Improved custom scalars

In `0.8`, we removed custom scalar logic from the preconfigured `BaseModel`, instead using pydantic's `BeforeValidator` and `PlainSerializer`. Now for every custom scalar provided in `pyproject.toml`, we generate an annotation that is used in generated arguments, results, and input models.

Example of generated annotations:

```toml
[tool.ariadne-codegen]
...
files_to_include = [".../type_b.py"]

[tool.ariadne-codegen.scalars.SCALARA]
type = "str"

[tool.ariadne-codegen.scalars.DATETIME]
type = "datetime.datetime"

[tool.ariadne-codegen.scalars.SCALARB]
type = ".type_b.TypeB"
parse = ".type_b.parse_b"
serialize = ".type_b.serialize_b"
```

```py
# scalars.py

from datetime import datetime
from typing import Annotated

from pydantic import BeforeValidator, PlainSerializer

from .type_b import TypeB, parse_b, serialize_b

SCALARA = str
DATETIME = datetime
SCALARB = Annotated[TypeB, PlainSerializer(serialize_b), BeforeValidator(parse_b)]
```

`BaseModel` no longer depends on `scalars.py`, so now we can customize file name through the `scalars_module_name` option.

Scalars file has complellty different structure, so we removed `generate_scalars_parse_dict` and `generate_scalars_serialize_dict` plugin hooks. Instead, we introduced `generate_scalar_annotation` and `generate_scalar_imports` hooks.

## Mixin directive

Ariadne Codegen 0.8 brings support for using the `mixin` directive on fragment definitions.

For example, given this fragment definition:

```gql
fragment fragmentA on TypeA @mixin(from: ".mixins", import: "MixinA") {
  fieldA
}
```

Generated `FragmentA` will inherit from `MixinA`:

```python
# fragments.py

from .base_model import BaseModel
from .mixins import MixinA


class FragmentA(BaseModel, MixinA):
    field_a: int = Field(alias="fieldA")
```

Additionally, from now on, the `mixin` directive will be excluded from the operation string, which is sent to a graphql server.

## Field names

Version `0.8` introduces improvements in generating field names. It will append `_` to generated field name that would be already reserved by pydantic `BaseModel`'s methods and attributes.

We also added handling of field names which consist only of underscores. It will be generated as `underscore_named_field_`. This behavior has the lowest priority in our name processing, so such a field's name can be altered by using an alias or utilizing `process_name` plugin hook.

## Unified annotations

We changed the generated client to use `typing.Dict` and `typing.List` instead of `dict` and `list`. That way, used annotations don't prevent using a generated client with older versions of Python.

## Changelog

- Added support for `Upload` scalar. Added support for file uploads to `AsyncBaseClient` and `BaseClient`.
- Added validation of defined operations against the schema.
- Removed `mixin` directive from fragment string included in operation string sent to server.
- Added support for `mixin` directive on fragments definitions.
- Added support for fragments defined on subtype of field's type.
- Added default representation for a field name consisting only of underscores.
- Changed generated client and models to use pydantic v2.
- Changed custom scalars implementation to utilize pydantic's `BeforeValidator` and `PlainSerializer`. Added `scalars_module_name` option. Replaced `generate_scalars_parse_dict` and `generate_scalars_serialize_dict` with `generate_scalar_annotation` and `generate_scalar_imports` plugin hooks.
- Unified annotations in generated client to be compatible with python < 3.9.
- Fixed generating default values of input types from remote schemas.
- Changed generating of input and result field names to add `_` to names reserved by pydantic.
