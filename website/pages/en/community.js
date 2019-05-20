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
        "See [guide for contributors](https://github.com/mirumee/ariadne/blob/master/CONTRIBUTING.md) and [issue tracker](https://github.com/mirumee/ariadne/issues).",
      title: "Contribute to Ariadne"
    },
    {
      content:
        "Share the love, ask questions or simply say hello on our [Spectrum](https://spectrum.chat/ariadne) community.",
      title: "Discuss"
    },
    {
      content: `Read our [blog](${blogUrl}) for latest bits and news from Ariadne.`,
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
          <p>This project is maintained by a dedicated group of people.</p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
