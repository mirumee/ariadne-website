import type { ReactNode } from "react";
import clsx from "clsx";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Schema-first Server",
    Svg: require("@site/static/img/schema-first.svg").default,
    description: (
      <>
        <Link href="/server/intro">Ariadne Server</Link> gives you ability to
        describe your GraphQL API using Schema Definition Language and connect
        your business logic using a minimal amount of Python boilerplate.
      </>
    ),
  },
  {
    title: "Type-safe Client",
    Svg: require("@site/static/img/simple.svg").default,
    description: (
      <>
        <Link href="/client/intro">Ariadne Codegen</Link> is a generator that
        turns your GraphQL schema and operations into a fully typed Python
        client, including Pydantic models.
      </>
    ),
  },
  {
    title: "Open Design",
    Svg: require("@site/static/img/open-design.svg").default,
    description: (
      <>
        Easily add new features to the library, and replace or extend existing
        ones. Integrate with any web framework you like.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <Svg className={styles.featureSvg} role="img" />
      <div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

type CodeItem = {
  title?: string;
  code: string;
  language: string;
};

type FeatureCodeItem = {
  title: string;
  code: CodeItem[];
  children: ReactNode;
};

export function FeatureWithCodeBlock({
  title,
  code,
  children,
}: FeatureCodeItem): ReactNode {
  return (
    <div className="row padding-bottom--lg">
      <div className="col col--6">
        <Heading as="h3">{title}</Heading>
        {children}
      </div>
      <div className="col col--6">
        {code.map(({ title, code, language }, idx) => (
          <CodeBlock key={idx} title={title} language={language}>
            {code}
          </CodeBlock>
        ))}
      </div>
    </div>
  );
}
