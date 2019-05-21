/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

class Footer extends React.Component {
  docUrl(doc) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    return `${baseUrl}${docsPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                height="107"
                width="128"
              />
            )}
          </a>
          <div className="footerNavSpacer" />
          <div className="footerNavTwoColumn">
            <h5>Documentation</h5>
            <a href={this.docUrl("intro.html")}>Introduction</a>
            <a href={this.docUrl("resolvers.html")}>Resolvers</a>
            <a href={this.docUrl("mutations.html")}>Mutations</a>
            <a href={this.docUrl("subscriptions.html")}>Subscriptions</a>
            <a href={this.docUrl("django-integration.html")}>
              Django integration
            </a>
            <a href={this.docUrl("flask-integration.html")}>
              Flask integration
            </a>
            <a href={this.docUrl("starlette-integration.html")}>
              Starlette integration
            </a>
            <a href={this.docUrl("other-integrations.html")}>
              Other integrations
            </a>
            <a href={this.docUrl("api-reference.html")}>API Reference</a>
            <a href={this.docUrl("logo.html")}>Logo</a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="https://spectrum.chat/ariadne">Spectrum</a>
            <a href="https://github.com/mirumee/ariadne">GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/mirumee/ariadne/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>
        <section className="copyright">
          <a href="https://mirumee.com">
            {`Copyright © ${new Date().getFullYear()} Mirumee Software`}
          </a>
          <a href="https://mirumee.com">
            Ariadne is crafted with love by
            <img
              src={this.props.config.baseUrl + this.props.config.mirumeeIcon}
              alt="Mirumee"
            />
          </a>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
