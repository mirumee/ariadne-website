---
id: schema-directives
title: Schema directives
---

Schema directives are special annotations that API developer may use to change or extend query executor's behaviour for selected elements of the schema. Those annotations are defined using dedicated syntax and then consumed during the executable schema creation by Ariadne.


## Defining schema directives

Schema directive definition begins with `directive` keyword. This keyword is followed with the name prefixed with ampersand, optional list of arguments and list locations for which this directive may be applied on.

Example directive that changes behaviour of schema field could be defined as such:

```graphql
directive @example on FIELD_DEFINITION
```

If directive takes any arguments, those can be defined after its name using same syntax that fields use:

```graphql
directive @example(arg1: String, arg2: Int!) on FIELD_DEFINITION
```

In case when directive may be used in more than one location, locations should be separated using the pipe sign:

```graphql
directive @example on OBJECT | FIELD_DEFINITION
```

Location may be any of following:

- `SCHEMA`
- `SCALAR`
- `OBJECT`
- `FIELD_DEFINITION`
- `ARGUMENT_DEFINITION`
- `INTERFACE`
- `UNION`
- `ENUM`
- `ENUM_VALUE`
- `INPUT_OBJECT`
- `INPUT_FIELD_DEFINITION`


## Applying directives to schema items

```graphql
type User @mydirective {
    id: ID
    username: String
}

type Thread {

}
```


## Implementing schema directive behaviour

In Ariadne, schema directive behaviour is implemented by extending `ariadne.SchemaDirectiveVisitor` base class. 


## Example: `datetime` format

Following example implements schema directive that formats Python `datetime` object returned by field's resolver.

First, add directive definition to your schema:

```graphql
directive @date(format: String) on FIELD_DEFINITION
```

Next, create Python implementation for the directive that defines the `visit_field_definition` method:

```python
from ariadne import SchemaDirectiveVisitor, default_field_resolver


class DateDirective(SchemaDirectiveVisitor):
    def visit_field_definition(self, field, object_type):
        date_format = self.args.get("format")
        original_resolver = field.resolve or default_field_resolver

        def resolve_formatted_date(obj, info, **kwargs):
            result = original_resolver(obj, info, **kwargs)
            if result is None:
                return None

            if date_format:
                return result.strftime(date_format)

            return result.isoformat()

        field.resolve = resolve_formatted_date
        return field
```

Finally, use `directives` option of `make_executable_schema` to attach the behaviour implemented by `DateDirective` with `date` directive definied by schema:

```python
schema = make_executable_schema(type_defs, resolvers, directives={"date": DateDirective})
```

You can now update your schema and use your `@date` directive to format dates returned by your API:

```graphql
type Article {
    id: ID
    title: String
    text: String
    createdAt: String @date(format: "%Y-%m-%d")
}
```