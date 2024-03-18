---
title: Ariadne Codegen 0.13
---

Ariadne Codegen 0.13 is now available. This is a bugfix release that addresses reported issues.

<!--truncate-->

## Re-added `model_rebuild` calls

Ariadne Codegen 0.11 removed `model_rebuild` calls from the generated code on the basis of Pydantic v2's self-healing capabilities.

Sadly reality verified this feature, making it necessary for us to mostly revert the change from 0.11.

Ariadne Codegen 0.13 scans generated models for forward references and includes `model_rebuild` calls for models that contain those.


## Fixed potential name conflicts between field args and generated client's method code

Naming a field argument `query`, `variables`, `data` or `result` would prevent the generated method to work or produce type errors for variable redefinition with different type.

Ariadne Codegen 0.13 detects name collisions and then prefixes its own names with `_` in generated client's methods.


## CHANGELOG

- Fixed `str_to_snake_case` utility to capture fully capitalized words followed by an underscore.
- Re-added `model_rebuild` calls for models with forward references.
- Fixed potential name conflicts between field args and generated client's method code.