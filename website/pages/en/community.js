/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const { config: siteConfig, language = "" } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const blogUrl = `${baseUrl}blog/`;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
  const langPart = `${language ? `${language}/` : ""}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content:
        "Help us make Python GraphQL even more awesome. See [the Contributors Guide](https://github.com/mirumee/ariadne/blob/master/CONTRIBUTING.md) and [Issue Tracker](https://github.com/mirumee/ariadne/issues) to get involved.",
      title: "Contribute to Ariadne"
    },
    {
      content:
        "Share the love, ask questions or simply say hello on our [Spectrum](https://spectrum.chat/ariadne) community.",
      title: "Discuss"
    },
    {
      content: `Check out our  [blog](${blogUrl}) for the latest Ariadne news, as well as our musings on all that is GraphQL and Python.`,
      title: "Stay up to date"
    }
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Get involved</h1>
          </header>
          <p>
            Ariadne is built and maintained by an open group of GraphQL and
            Python enthusiasts.
          </p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
