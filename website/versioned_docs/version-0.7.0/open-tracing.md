---
id: version-0.7.0-open-tracing
title: OpenTracing
original_id: open-tracing
---

Ariadne provides an extension that implements the [OpenTracing](https://opentracing.io/) specification, making it easy to monitor GraphQL API performance and errors using popular APM tools like [Datadog](https://www.datadoghq.com/) or [Jaeger](https://www.jaegertracing.io/).

> **Note:** for performance reasons OpenTracing extension excludes default resolvers.


## Enabling OpenTracing in the API

To enable OpenTracing in your API, import the `OpenTracingExtension` class from `ariadne.contrib.tracing.opentracing` and pass it to your server `extensions` option:

```python
from ariadne.contrib.tracing.opentracing import OpenTracingExtension

app = GraphQL(
    schema,
    debug=True,
    extensions=[OpenTracingExtension],
)
```

> **Note:** If using WSGI, use `OpenTracingExtensionSync` in place of `OpenTracingExtension`.

> **Note:** If you don't have OpenTracing already configured in your project, you will need to install the [`opentracing-python`](https://github.com/opentracing/opentracing-python) package and [configure tracer](https://opentracing.io/guides/python/tracers/) for your APM solution.


## Sanitizing sensitive arguments data

By default all arguments are sent to the APM service. If your API fields have arguments for sensitive data like passwords or tokens, you will need to sanitize those before sending tracking data to the service.

`OpenTracingExtension` has single configuration option named `arg_filter`, that can be a function that extension will call with the copy of the dict of arguments previously passed to field's resolver.

Because extension instances are created per request, `OpenTracingExtension` can't be instantiated inside the `extensions`. Instead Ariadne provides `opentracing_extension` utility that creates partial function that initializes the `OpenTracingExtension` with `arg_filter` option per request.

Here is an example defining custom sanitizing function named `my_arg_filter` and using `opentracing_extension` to enable OpenTracing with it:

```python
from ariadne.contrib.tracing import opentracing_extension

def my_arg_filter(args, info):
    if "password" in args:
        args["password"] = "[redacted]"
    if "secret" in args:
        args["secret"] = "[redacted]"
    for key, value in args.items():
        if isinstance(value, dict):
            args[key] = my_arg_filter(value)
        if isinstance(value, list):
            args[key] = [my_arg_filter(v) for v in value]
    return args


schema = make_executable_schema(type_def, [query, mutation])
app = GraphQL(
    schema,
    debug=True,
    extensions=[
        opentracing_extension(arg_filter=my_arg_filter),
    ],
)
```

> **Note:** If you are using WSGI, use `opentracing_extension_sync` in place of `opentracing_extension`.
