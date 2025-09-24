import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import {
  HomepageFeatures,
  FeatureWithCodeBlock,
} from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          GraphQL in Python
          <br />
          Schema-First Server
          <br />
          Type-safe Client
        </Heading>
        <p className="hero__subtitle">
          Check out our&nbsp;
          <Link href="https://github.com/mirumee/Ariadne?tab=readme-ov-file#ariadne-ecosystem">
            GitHub repo
          </Link>
          .
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className="container padding-top--lg">
          <Heading as="h2" className={styles.featuresCodeHeader}>
            GraphQL Server
          </Heading>
          <FeatureWithCodeBlock
            title="Define schema using SDL"
            code={[
              {
                language: "python",
                code: `from ariadne import gql, load_schema_from_path

# load schema from file...
schema = load_schema_from_path("schema.graphql")

# ...directory containing graphql files...
schema = load_schema_from_path("schema")

# ...or inside Python files
schema = gql("""
  type Query {
    user: User
  }

  type User {
    id: ID
    username: String!
  }
""")`,
              },
            ]}
          >
            <p>
              Enable frontend and backend teams to cooperate effectively.
              Ariadne taps into the leading approach in the GraphQL community
              and opens up hundreds of developer tools, examples, and learning
              resources.
            </p>
            <p>
              Ariadne provides out of the box utilities for loading schema from
              GraphQL files or Python strings.
            </p>
          </FeatureWithCodeBlock>
          <FeatureWithCodeBlock
            title="Add business logic to schema with minimal boilerplate"
            code={[
              {
                language: "python",
                code: `from ariadne import QueryType

from .models import Category, Promotion

query = QueryType()

@query.field("categories")
async def resolve_categories(*_):
    return await Category.query.where(Category.depth == 0)


@query.field("promotions")
async def resolve_promotions(*_):
    return await Promotion.query.all()`,
              },
            ]}
          >
            <p>
              Use specialized objects that connect business logic to the schema.
              Replace whatever you like and roll out your own implementations to
              fit your team's needs.
            </p>
          </FeatureWithCodeBlock>
          <FeatureWithCodeBlock
            title="Fully asynchronous"
            code={[
              {
                language: "python",
                code: `from ariadne import QueryType

from .models import Category, Promotion

query = QueryType()

@query.field("categories")
async def resolve_categories(*_):
    return await Category.query.where(Category.depth == 0)


@query.field("promotions")
async def resolve_promotions(*_):
    return await Promotion.query.all()`,
              },
            ]}
          >
            <p>
              Use asynchronous query execution and ASGI to speed up your API
              with minimal effort.
              <p> </p>
              If your stack is not yet ready for async, don't worry -
              synchronous query execution is also available.
            </p>
          </FeatureWithCodeBlock>
          <FeatureWithCodeBlock
            title="Serve your API however you want"
            code={[
              {
                language: "python",
                code: `# As standalone ASGI or WSGI app...
from ariadne.asgi import GraphQL

from .schema import schema

app = GraphQL(schema, debug=True)

# ...or add GraphQL API to your favorite web framework
from ariadne.contrib.django.views import GraphQLView
from django.urls import include, path

from .schema import schema

urlpatterns = [
    ...
    path('graphql/', GraphQLView.as_view(schema=schema), name='graphql'),
]`,
              },
            ]}
          >
            <p>
              Ariadne provides WSGI and ASGI apps enabling easy implementation
              of custom GraphQL services, and full interoperability with popular
              web frameworks.
              <p></p>
              Even if your technology has no resources for adding GraphQL to
              your stack, use the simple guide to create new integrations with
              Ariadne.
            </p>
          </FeatureWithCodeBlock>
        </section>
        <section className="container padding-top--lg">
          <Heading as="h2">GraphQL Client</Heading>
          <FeatureWithCodeBlock
            title="Generate Pydantic models from schema"
            code={[
              {
                language: "graphql",
                title: "Query defines a User type by fragment",
                code: `fragment User on User {
  id
  firstName
  lastName
}

query GetUser($id: ID!) {
  user(id: $id) {
    ...User
  }
}`,
              },
              {
                language: "python",
                code: `# Ariadne Codegen generates a Pydantic model:
from graphql_client.fragments import User

# Result of query is parsed into a model
user = User(id="1", first_name="John", last_name="Snow")

print(user.first_name)  # "John"
print(user.last_name)   # "Snow"

print(user.model_dump()) # {'id': '1', 'first_name': 'John', 'last_name': 'Snow'}`,
              },
            ]}
          >
            <p>
              Ariadne Codegen creates strongly typed client methods for each
              operation you define.
            </p>
            <p>
              Each function returns data validated against Pydantic models
              generated from your fragments and schema, ensuring correctness at
              runtime and full autocomplete in your editor.
            </p>
          </FeatureWithCodeBlock>
          <FeatureWithCodeBlock
            title="Typed client functions with validation"
            code={[
              {
                language: "graphql",
                code: `query GetUser($id: ID!) {
  user(id: $id) {
    id
    firstName
    lastName
  }
}`,
              },
              {
                language: "python",
                title:
                  "After running ariadne-codegen, the client has a get_user() method",
                code: `from graphql_client import Client

client = Client(url="https://example.com/graphql")
result = await client.get_user(id="1")
user = result.user  # fully typed Pydantic model

print(user.first_name)  # "John"
print(user.last_name)   # "Snow"

print(user.model_dump()) # {'id': '1', 'first_name': 'John', 'last_name': 'Snow'}`,
              },
            ]}
          >
            <p>
              Ariadne Codegen creates strongly typed client methods for each
              operation you define.
            </p>
            <p>
              Each function returns data validated against Pydantic models
              generated from your fragments and schema, ensuring correctness at
              runtime and full autocomplete in your editor.
            </p>
          </FeatureWithCodeBlock>
          <FeatureWithCodeBlock
            title="Build custom operations programmatically"
            code={[
              {
                language: "python",
                code: `from graphql_client import Client
from graphql_client.custom_fields import (
    ProductFields,
)
from graphql_client.custom_queries import Query


async def get_products():
    # Create a client instance with the specified URL and headers
    client = Client(
        url="https://example.com/graphql",
    )

    # Build the queries programmatically
    product_query = Query.product(id="1").fields(
        ProductFields.id,
        ProductFields.name,
    )

    # Execute both queries with a custom operation name
    response = await client.query(
        product_query,
        operation_name="get_products",
    )`,
              },
            ]}
          >
            <p>
              With the custom operation builder, Ariadne Codegen generates
              helpers for queries, fields, and fragments.
            </p>
            <p>
              This lets you construct complex GraphQL operations in Python with
              chaining, aliases, and inline fragments, while still getting
              type-safe responses validated against Pydantic models.
            </p>
          </FeatureWithCodeBlock>
        </section>
      </main>
    </Layout>
  );
}
