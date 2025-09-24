---
title: Ariadne Codegen 0.12
---

Ariadne Codegen 0.12 has been released!

This is a maintenance release that fixes reported bugs in Pydantic models creation, subscriptions, plugins and adds support for saving schema to `graphql` file.

<!--truncate-->

## Fixed `graphql-transport-ws` protocol implementation not waiting for the `connection_ack` message on new connection

Async client for `graphql-transport-ws` protocol didn't await for the `connection_ack` message on the new connection to the GraphQL server.

This has been addressed in Ariadne Codegen 0.12.

## Fixed `get_client_settings` mutating `config_dict` instance

Ariadne Codegen mutated `config_dict` on initialization, which caused errors when plugins attempted to access changed or removed keys in the configuration dict.

In 0.12 `config_dict` is first copied before being changed, preserving the original dict for plugins.

## Restored `model_rebuild` calls for top level fragment models

`model_rebuild` calls were previously removed from Ariadne Codegen to improve the generated client's initialization performance.

This caused an issue where lazy references were not completed by Pydantic on initialization, breaking those in the client.

0.12 attempts to detect scenarios where `model_rebuild` are necessary and includes them in the generated client.

## Added support to `graphqlschema` for saving schema as a GraphQL file

Ariadne Codegen provides the `graphqlschema` command which creates a local copy of specified schema.

Previously this copy was always a Python declaration of the `GraphQLSchema` instance, but since 0.12 it is now possible to create a copy in GraphQL Schema Definition Language.

Output format is controlled by the file extension used in the `target_file_path` configuration option:

- `.py` will produce a Python file with `GraphQLSchema` instance.
- `.graphql` and `.gql` will produce a GraphQL file with SDL schema definition.

## Changelog

- Fixed `graphql-transport-ws` protocol implementation not waiting for the `connection_ack` message on a new connection.
- Fixed `get_client_settings` mutating `config_dict` instance.
- Added support to `graphqlschema` for saving schema as a GraphQL file.
- Restored `model_rebuild` calls for top level fragment models.
