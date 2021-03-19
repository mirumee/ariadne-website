/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const Container = CompLibrary.Container;
const MarkdownBlock = CompLibrary.MarkdownBlock;

function Community(props) {
  const { config: siteConfig, language = "" } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const blogUrl = `${baseUrl}blog/`;

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1 className="postHeaderTitle">Community</h1>
          </header>
          <p>
            Ariadne is built and maintained by an open community of GraphQL and
            Python enthusiasts.
          </p>
          <hr />
          <h2>Contribute to Ariadne</h2>
          <MarkdownBlock>
            Help us make Python GraphQL even more awesome. See [the Contributors
            Guide](https://github.com/mirumee/ariadne/blob/master/CONTRIBUTING.md)
            and [Issue Tracker](https://github.com/mirumee/ariadne/issues) to
            get involved.
          </MarkdownBlock>
          <hr />
          <h2>Discuss</h2>
          <MarkdownBlock>
            Share the love, ask questions or simply say hello on our
            [GitHub](https://github.com/mirumee/ariadne/discussions/) community.
          </MarkdownBlock>
          <hr />
          <h2>Stay up to date</h2>
          <MarkdownBlock>
            {`Check out our [blog](${blogUrl}) for the latest Ariadne news, as well as our musings on all that is GraphQL and Python.`}
          </MarkdownBlock>
        </div>
      </Container>
    </div>
  );
}

Community.title = "Community";
Community.description =
  "Ariadne is built and maintained by an open community of GraphQL and Python enthusiasts.";

module.exports = Community;
