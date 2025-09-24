import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Ariadne · Python GraphQL Schema-first",
  tagline: "Python GraphQL",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },
  url: "https://ariadnegraphql.org",
  baseUrl: "/",

  organizationName: "mirumee",
  projectName: "ariadne-website",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          id: "server",
          path: "docs",
          routeBasePath: "server",
          sidebarPath: "./serverSidebars.ts",
          lastVersion: "0.25",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: ["./src/css/custom.css"],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // [
    //   "@docusaurus/plugin-content-docs",
    //   {
    //     id: "client",
    //     path: "client",
    //     routeBasePath: "client",
    //     sidebarPath: "./clientSidebars.ts",
    //   },
    // ],
  ],

  themeConfig: {
    algolia: {
      appId: "BYJBYPP90Q",
      apiKey: "495d71e85ee391dd7df164ff0ac02a75",
      indexName: "ariadnegraphql",
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
    },
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      logo: {
        alt: "Ariadne Logo",
        src: "img/logo-horizontal-sm.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Server Docs",
          docsPluginId: "server",
        },
        {
          type: "docsVersionDropdown",
          docsPluginId: "server",
          position: "left",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/mirumee/Ariadne?tab=readme-ov-file#ariadne-ecosystem",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Ariadne ecosystem",
          items: [
            {
              label: "Ariadne GraphQL Server",
              href: "https://github.com/mirumee/ariadne?tab=readme-ov-file",
            },
            {
              label: "Ariadne GraphQL Client",
              href: "https://github.com/mirumee/ariadne-codegen?tab=readme-ov-file",
            },
            {
              label: "Ariadne GraphQL Modules",
              href: "https://github.com/mirumee/ariadne-graphql-modules?tab=readme-ov-file",
            },
            {
              label: "Ariadne Auth",
              href: "https://github.com/mirumee/ariadne-auth?tab=readme-ov-file",
            },
            {
              label: "Ariadne AWS Lambda Extension",
              href: "https://github.com/mirumee/ariadne-lambda?tab=readme-ov-file",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Email",
              href: "mailto:ariadne@mirumee.com",
            },
            {
              label: "X",
              href: "https://x.com/AriadneGraphQL",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              href: "https://mirumee.com/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/mirumee/Ariadne?tab=readme-ov-file#ariadne-ecosystem",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}  Mirumee Software.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
