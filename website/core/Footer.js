/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
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
          <div />
          <div>
            <h5>Documentation</h5>
            <a href={this.docUrl("doc1.html", this.props.language)}>Guide</a>
            <a href={this.docUrl("doc3.html", this.props.language)}>
              Integrations
            </a>
            <a href={`${this.props.config.baseUrl}blog`}>Blog</a>
          </div>
          <div>
            <h5>Social</h5>
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
