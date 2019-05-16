/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Lead = () => (
      <h1 className="projectLead">
        Python GraphQL
        <br />
        Schema-First
      </h1>
    );

    const PromoSection = props => (
      <div className="section promoSection homeCtaSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button ctaButton" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <Lead />
          <PromoSection>
            <Button href={docUrl("intro.html")}>Get started</Button>
            <span className="ctaSpacer">or check our</span>
            <a className="ctaLink" href={siteConfig.repoUrl} target="_blank">
              GitHub
            </a>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container id={props.id} background={props.background}>
        <GridBlock contents={props.children} layout={props.layout} />
      </Container>
    );

    const FocusBlock = ({ children }) => (
      <Container>
        <div className="codeFocusedBlock">{children}</div>
      </Container>
    );

    const FocusContent = ({ children, title }) => (
      <div className="codeFocusedBlockContent">
        <h4>{title}</h4>
        <MarkdownBlock>{children}</MarkdownBlock>
      </div>
    );

    const FocusCode = ({ children }) => (
      <div className="codeFocusedBlockCode">
        <MarkdownBlock>{"```python\n" + children}</MarkdownBlock>
      </div>
    );

    const Features = () => (
      <div className="homePromoSection">
        <Block layout="fourColumn">
          {[
            {
              content:
                "Describe your GraphQL API using Schema Definition Language and then connect your business logic using Python.",
              image: `${baseUrl}img/schema-first.svg`,
              imageAlign: "top",
              title: "Schema First"
            },
            {
              content:
                "Small and easy to learn Pythonic API. Ariadne has been built with simplicity as the guiding force behind its design. We don't over-complicate the complex.",
              image: `${baseUrl}img/simple.svg`,
              imageAlign: "top",
              title: "Simple"
            },
            {
              content:
                "It's easy to add new features to the library, as well as replace or extend existing ones.",
              image: `${baseUrl}img/open-design.svg`,
              imageAlign: "top",
              title: "Open Design"
            }
          ]}
        </Block>
      </div>
    );

    const SDLFocusBlock = () => (
      <FocusBlock>
        <FocusContent title="Define schema using SDL">
          {[
            "Using SDL to define your schema is the leading approach used by the GraphQL community and supported by dozens of frontend and backend developer tools, examples, and learning resources.",
            "",
            "Ariadne provides out of the box utilities for loading schema from GraphQL files or Python strings."
          ].join("\n")}
        </FocusContent>
        <FocusCode>
          {`
from ariadne import gql, load_schema_from_path

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
""")
`.trim()}
        </FocusCode>
      </FocusBlock>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <SDLFocusBlock />
          <SDLFocusBlock />
          <SDLFocusBlock />
        </div>
      </div>
    );
  }
}

module.exports = Index;
