---
title: Ariadne GraphQL Proxy 0.3
---

Ariadne GraphQL Proxy 0.3 is now available.

This release implements new features we found necessary for our use cases and fixes the issues we've found in testing.

<!--truncate-->

## Cache serializers

Cache backends now support serializer customization for better control on how data is dehydrated and re-hydrated for selected cache store.

## Fixed schema proxy error when variable in operation was not in `variables`

GraphQL supports optional variables. Those are variables which can be either `null` or are omitted from `variables`.

Previously, Ariadne GraphQL Proxy would crash with `KeyError` if optional variable was omitted from `variables`. This was fixed in 0.3 release.

## Fixed `union` fields support

Ariadne GraphQL Proxy would attempt to retrieve a list of fields for `union` type, crashing with a `KeyError`.

In 0.3 release GraphQL Proxy is aware of `union` types and implements a dedicated query splitting logic for fields returning them.

## Custom headers

Custom headers configuration was improved for both `ProxyResolver` and `ProxySchema`.

It is now possible to set default headers that should be included in requests made by the Proxy, enabling GraphQL access to APIs requiring auth for schema introspection.

## Proxy errors and extensions from upstream.

For remote schemas it is now possible to enable proxying of GraphQL errors and extensions.

Because proxy mechanism uses the strategy pattern, it's also possible to customize how proxied data appears in a final JSON with query's result.

## Fields dependencies

Field's dependencies are additional fields that should be retrieved from the upstream GraphQL API when given field is requested.

This feature is useful when final schema includes new fields that should be resolved from other fields, which themselves shouldn't be included in the final schema.

## CHANGELOG

- Added `CacheSerializer`, `NoopCacheSerializer` and `JSONCacheSerializer`. Changed `CacheBackend`, `InMemoryCache`, `CloudflareCacheBackend` and `DynamoDBCacheBackend` to accept `serializer` initialization option.
- Fixed schema proxy returning an error when variable defined in an operation is missing from its variables.
- Fixed query `union` fields support.
- Improved custom headers handling in `ProxyResolver` and `ProxySchema`.
- Proxy errors and extensions from upstream.
- Added fields dependencies configuration option to `ProxySchema`.
