---
title: Ariadne Codegen 0.11
---

Ariadne Codegen 0.11 is now available!

This release brings performance improvements and new options for default base clients.

<!--truncate-->

## Removed `model_rebuild` calls

Pydantic v2 has changed the way forward refs are handled during model class initialisation. If an annotation couldn't be resolved, an auto-rebuild is performed during the first validation attempt. Because of this, we're removing all `model_rebuild` calls from the generated package.

## Generating only used inputs and enums

Version 0.11 introduces 2 new configuration flags that can be used to reduce the number of unused generated models:

- `include_all_inputs` (defaults to `true`) - when set to `true` the generated package will include a model for every input defined in the schema, otherwise it will only generate inputs used by defined operations.

- `include_all_enums` (defaults to `true`) - specifies whether to include all enums defined in the schema, or only those used in operations.

## `NoReimportsPlugin`

In 0.11, we are adding `NoReimportsPlugin` to the `ariadne_codegen.contrib` package. It removes the contents of the generated `__init__.py`. This is useful in scenarios where the generated package contains so many Pydantic models that the client's eager initialisation of the entire package on first import is very slow.

## Including `operationName` in payload

The generated client methods will now pass the name of the operation as the `operation_name` argument to the `execute` and `execute_ws` methods of the base client. For example:

```python
async def list_all_users(self, **kwargs: Any) -> ListAllUsers:
    query = gql(
        """
        query ListAllUsers {
          users {
            id
          }
        }
        """
    )
    variables: Dict[str, object] = {}
    response = await self.execute(
        query=query, operation_name="ListAllUsers", variables=variables, **kwargs
    )
    data = self.get_data(response)
    return ListAllUsers.model_validate(data)
```

Default base clients will also include the given `operation_name` as `operationName` in the sent payload.

## Payload without `data`, but with `errors` key

We have changed the base clients to raise `GraphQLClientGraphQLMultiError` instead of `GraphQLClientInvalidResponseError` for payloads without `data` but with `errors` key.

## Renamed invalid response error

To match the convention of other exceptions included with the base default clients, we have renamed `GraphQLClientInvalidResponseError` to `GraphQLClientInvalidResponseError` (with a capital `L`).

## Changelog

- Removed `model_rebuild` calls for generated input, fragment and result models.
- Added `NoReimportsPlugin` that makes the `__init__.py` of generated client package empty.
- Added `include_all_inputs` config flag to generate only inputs used in supplied operations.
- Added `include_all_enums` config flag to generate only enums used in supplied operations.
- Added `operationName` to payload sent by generated client's methods.
- Fixed base clients to pass `mypy --strict` without installed optional dependencies.
- Renamed `GraphQlClientInvalidResponseError` to `GraphQLClientInvalidResponseError` (breaking change).
- Changed base clients to raise `GraphQLClientGraphQLMultiError` for payloads with `errors` key but no `data` (breaking change).
