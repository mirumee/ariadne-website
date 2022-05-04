---
title: Ariadne GraphQL Modules 0.4.0
---


Ariadne GraphQL Modules 0.4.0 has been released!

This release changes datamodel, simplifying the `BaseType` and moving its logic to new `DefinitionType` and `BindableType` base classes.

It also introduces new `CollectionType` that can be used to gather multiple types into single type, eg.:

```python
class UserMutations(CollectionType):
    __types__ = [
        UserAvatarUploadMutation,
        UserAvatarRemoveMutation,
        UserCreateMutation,
        UserUpdateMutation,
        UserDeleteMutation,
    ]
```

<!--truncate-->


## Changelog

- Split logic from `BaseType` into `DefinitionType` and `BindableType`.
- Add `CollectionType` utility type for gathering types into single type.
