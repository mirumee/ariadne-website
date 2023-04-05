---
title: Ariadne Codegen 0.5
---

Ariadne Codegen 0.5 is now available!

This release brings multiple small new options and improvements to `ariande-codegen` command.

<!--truncate-->

## Disabling SSL verification for remote schemas

New `remote_schema_verify_ssl` option can now be used to control SSL certificate verification during the remote schema download.

This option is enabled by default and should only be disabled with good reasons, like when you are running calls over the internal network that uses self-signed certificates.


## Support for custom names of operation types

`ariadne-codegen` previously assumed that root types in GraphQL schema are always named `Query` and `Mutation`, but we were informed that `Hasura` uses `query_root` and `mutation_root` instead.

Starting with 0.5 release operation roots are instead resolved from `Schema` types's `query` and `mutation` fields.


## Generating Python declarations for GraphQL schemas

`ariadne-codegen` has new `graphqlschema` mode which generates a Python file containing complete declaration of GraphQL schema as `graphql.GraphQLSchema` instance.

This schema can be further converted into a string using the `graphql.print_schema` utility.


## Changelog

- Added generation of GraphQL schema's Python representation.
- Fixed annotations for lists.
- Fixed support of custom operation types names.
- Unlocked versions of black, isort, autoflake and dev dependencies
- Added `remote_schema_verify_ssl` option.
- Changed how default values for inputs are generated to handle potential cycles.
- Fixed `BaseModel` incorrectly calling `parse` and `serialize` methods on entire list instead of its items for `List[Scalar]`.
