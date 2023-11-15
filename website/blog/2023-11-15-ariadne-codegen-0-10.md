---
title: Ariadne Codegen 0.10
---

Ariadne Codegen 0.10 has been released!

This release improves the snake case conversion of operation names, adds opt-in support for Open Telemetry tracing, introduces the `ExtractOperationsPlugin` plugin, adds Python 3.12 to the supported versions, and brings other features and fixes.


<!--truncate-->

## Converting capitalized names and digits to snake case (breaking change)

Codegen converts given operation name to snake case. Result will later be used as name of a file containing generated models for operation, optionally (if `convert_to_snake_case` is set to `true`) also as client's method name. This release introduces changes to how numbers and capitalised names are handled in the conversion process, e.g:

| operation name    | old snake case            | new snake case        |
|-------------------|---------------------------|-----------------------|
| name              | name                      | name                  |
| operationName     | operation_name            | operation_name        |
| operationNAME     | operation_n_a_m_e         | operation_name        |
| OPERATIONName     | o_p_e_r_a_t_i_o_n_name    | operation_name        |
| operationName123  | operation_name123         | operation_name_123    |
| operationNAME123  | operation_n_a_m_e123      | operation_name_123    |

This change may require changes in code which uses generated client.


## Open Telemetry tracing

`0.10` ships with two additional base clients that support Open Telemetry tracing. When the `opentelemetry_client` configuration option is set to `true`, the default included base client is replaced with one that implements the opt-in Open Telemetry support - `BaseClientOpenTelemetry`/`AsyncBaseClientOpenTelemetry`. By default this support does nothing, but if the `opentelemetry-api` package is installed and the `tracer` argument is provided, then the client will create spans with data about requests made.

Tracing arguments handled by `BaseClientOpenTelemetry`:
- `tracer`: `Optional[Union[str, Tracer]] = None` - tracer object or name which will be passed to the `get_tracer` method
- `root_context`: `Optional[Context] = None` - optional context added to root span
- `root_span_name`: `str = "GraphQL Operation"` - name of root span

`AsyncBaseClientOpenTelemetry` supports all arguments which `BaseClientOpenTelemetry` does, but also exposes additional arguments regarding websockets:
- `ws_root_context`: `Optional[Context] = None` - optional context added to root span for websocket connection
- `ws_root_span_name`: `str = "GraphQL Subscription"` - name of root span for websocket connection


## Included comments

In `0.10` we change the `include_comments` option to allow selection of the style of comments to be included at the top of each generated file. Available options:
- `"timestamp"` - comment with generation timestamp
- `"stable"` - comment with message that this is a generated file (new default)
- `"none"` - no comments

Previous boolean support is deprecated and will be dropped in future releases, but for now `false` is mapped to `"none"` and `true` to `"timestamp"`.


## `ExtractOperationsPlugin`

In version `0.10` we include `ExtractOperationsPlugin`. It extracts query strings from the generated client's methods into a separate `operations.py` module. It also modifies the generated client to import these definitions, the generated module name can be customised by adding `operations_module_name="custom_name"` to the `[tool.ariadne-codegen.operations]` section in config. E.g:

```gql
# queries.graphql
query getName {
  name
}
```

`pyproject.toml`:

```toml
[tool.ariadne-codegen]
...
queries_path = "..../queries.graphql"
plugins = ["ariadne_codegen.contrib.extract_operations.ExtractOperationsPlugin"]

[tool.ariadne-codegen.extract_operations]
operations_module_name = "custom_operations"
```

Codegen with the configuration from above will generate `custom_operations.py`:

```python
__all__ = ["GET_NAME"]

GET_NAME = """
query getName {
  name
}
"""
```

The generated client imports `GET_NAME` and uses it instead of defining it's own operation string:

```python
from .custom_operations import GET_NAME
from .get_name import GetName


def gql(q: str) -> str:
    return q


class Client(AsyncBaseClient):
    async def get_name(self, **kwargs: Any) -> GetName:
        variables: Dict[str, object] = {}
        response = await self.execute(query=GET_NAME, variables=variables, **kwargs)
        data = self.get_data(response)
        return GetName.model_validate(data)
```


## Overloading arguments per call

Each generated client's method now accepts `**kwargs` and passes them to the `http_client.post`/`ws_connect` call made in the base client.


## Escaping enum values which are Python keywords

Similar to what we already do for generated models fields names, now codegen will add `_` sufix to enum values which are Python keywords, e.g:

```gql
enum CustomEnum {
    valid
    import
}
```

```python
# enums.py
from enum import Enum


class CustomEnum(str, Enum):
    valid = "valid"
    import_ = "import"
```


## Adding `__typename` to all models generated from unions and interfaces

In previous versions, models created from single-member unions or from interfaces that were queried without inline fragments didn't have an added `__typename` field. Now `0.10` includes this special field in all models generated from abstract types.


## Nullable fields with nullable directives

`0.10` fixes behaviour when the default `None` was not added to a nullable field with a `@skip`/`@include` directive.


## Ignored `enums_module_name`

Codegen now correctly reads `enums_module_name` and uses its value instead of always generating `enums.py`.


## Changelog

- Fixed generating results for nullable fields with nullable directives.
- Changed `include_comments` option to accept enum value, changed default to `"stable"`, deprecated boolean support. Added `get_file_comment` plugin hook.
- Changed `str_to_snake_case` utility to correctly handle capitalized words.
- Digits in Python names are now preceded by an underscore (breaking change).
- Fixed parsing of unions and interfaces to always add `__typename` to generated result models.
- Added escaping of enum values which are Python keywords by appending `_` to them.
- Fixed `enums_module_name` option not being passed to generators.
- Added additional base clients supporting the Open Telemetry tracing. Added `opentelemetry_client` config option.
- Changed generated client's methods to pass `**kwargs` to base client's `execute` and `execute_ws` methods (breaking change for custom base clients).
- Added `operation_definition` argument to `generate_client_method` plugin hook.
- Added `ExtractOperationsPlugin` that extracts operation strings from client methods to separate module.
- Added Python 3.12 to tested versions.
