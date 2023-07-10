---
title: GraphQL Gathering EU in Berlin
---

On the 4th of July Mirumee organized the GraphQL Gathering EU event together with The Guild, Saleor, Stellate, Escape and Hasura and support from the GraphQL Foundation.

This event took place in Spielfeld Digital Hub in Berlin. It used the unconference format where instead of a series of talks the attendees first submit the topics for discussion, then those topics are divided between three time slots, and people join the designated tables to discuss those based on their own interests.

Between those tables and talks in corridors, we've got a few takeaways that we've found relevant to the Ariadne and GraphQL developers using it.

<!--truncate-->

## Performance metrics

Ariadne out of the box provides extensions for enabling the Open Telemetry and Open Tracing metrics. Those extensions work by wrapping in telemetry spans all calls of custom resolvers by the GraphQL engine.

During the Gathering and and even before we've heard an opinion that this approach to GraphQL metrics is not good, as it fills the APM software with tons of data which can be best described as noise. Better approach postulated is having developers themselves implement those traces explicitly in resolvers they like to track performance of.

We are not planning to drop OpenTelemetry (or OpenTracing) extensions from Ariadne, but we may consider updating the existing documentation with a short note that the out of the box approach may not be what they want. Maybe the solution to the issue of having a lot of noise in metrics would be the `fields` option on extensions, enabling developers to limit them only to selected fields?


## Persisted queries

One of GraphQL's selling points is getting only the data you've queried for. But what about situations when this control should be reversed, and it's the server which should decide on fields to return it? One could go about implementing a separate REST or RPC API on the side, but now they need to maintain two separate APIs which can be considered grossly suboptimal.

One proposed solution to this issue is introduction of persisted queries to GraphQL. The idea is if GraphQL server received `operationName` within its payload, but not `query`, it would look up the list of predefined operations on its side using the name received. It would then either return an error, or run a query from persisted operation. This enables GraphQL to act as both the GraphQL API, but also, when needed, an RPC server.

This idea requires further development as there are still questions that need answering like how should stored procedures be discoverable by the clients in introspections.

Ariadne could provide limited support for persisted queries inside the `ariadne.contrib` package.


## Query complexity and cost checks

One discussion we've had at the Gathering was about the query complexity and validation. Ariadne implements a query cost validator that will calculate query cost and prevent query execution when a predefined limit is exceeded. However this topic is little more, well, complex than setting those costs limits:

- The biggest offenders are deep queries exploiting cycles within schema. Queries like products list -> category -> category products list -> reviewers -> reviewed products list. Prevent those from happening by avoiding fields returning lists outside of `Query` and `Mutation` results types.
- When in doubt, make fields returning lists paginated.
- Consider writing a GraphQL validator that limits the number of fields from `Query` or `Mutation` that can be queried in a single operation.
- Understand your users. Slow queries may not be the end of the world when they happen rarely. Maybe clients are looking for an easy way to pull a bunch of data to avoid waterfalls and you can improve the schema for them? Or maybe those clients are maintained by people sitting in the next room in the office and the issue may be resolved by asking nicely? Not every problem must be an engineering one.


## Combining and composing APIs in single GraphQL schema

Few weeks ago we launched the Ariadne GraphQL Proxy - our (prototype) solution for the problem of combining multiple APIs under a single GraphQL endpoint.

During the Gathering we've participated in a few discussions on the subject that gave us both ideas for future improvements to the API, but also understanding of priorities people have when implementing GraphQL gateways. We understand now people expect to be able to deploy those solutions as part of their CDN layer (like CloudFlare workers), to easily repackage OpenAPI compliant APIs as GraphQL, and to be able to quickly enable caching for hot paths.
