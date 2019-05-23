/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: "Mirumee Software",
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image: "/img/mirumee.png",
    infoLink: "https://mirumee.com",
    pinned: true
  }
];

const siteConfig = {
  title: "Ariadne", // Title for your website.
  tagline:
    "A Python library for implementing GraphQL servers using schema-first approach.",
  disableTitleTagline: true,
  url: "https://ariadnegraphql.org", // Your website URL
  baseUrl: "/", // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: "ariadne-website",
  organizationName: "mirumee",
  cname: "ariadnegraphql.org",
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  algolia: {
    apiKey: "507581234da84aebc8fe9918f530b714",
    indexName: "ariadnegraphql"
  },

  // Disable showing the title in the header next to the header icon.
  disableHeaderTitle: true,

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { search: true },
    { doc: "intro", label: "Docs" },
    { blog: true, label: "Blog" },
    { page: "community", label: "Community" }
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: "img/logo-horizontal.png",
  footerIcon: "img/icon.png",
  favicon: "img/favicon.ico",
  mirumeeIcon: "img/mirumee.png",

  /* Colors for website */
  colors: {
    primaryColor: "#dd3333",
    secondaryColor: "#1e3c12"
  },

  usePrism: ["graphql"],

  /* Custom fonts for website */
  fonts: {
    inter: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Helvetica",
      "Arial",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol"
    ]
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Crafted with ❤️ by Mirumee Software`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "default"
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ["https://buttons.github.io/buttons.js"],

  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,

  // Google Analytics tracking ID to track page views.
  gaTrackingId: "UA-10159761-23",

  // Open Graph and Twitter card images.
  ogImage: "img/share-image.png",
  twitterImage: "img/share-image.png",

  // Set this to true if you want to enable the scroll to top button
  // at the bottom of your site.
  scrollToTop: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: "https://github.com/mirumee/ariadne"
};

module.exports = siteConfig;
