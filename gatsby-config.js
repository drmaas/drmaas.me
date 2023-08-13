/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

const wrapESMPlugin = name =>
  function wrapESM(opts) {
    return async (...args) => {
      const mod = await import(name)
      const plugin = mod.default(opts)
      return plugin(...args)
    }
  }

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Thoughts on Software`,
    author: {
      name: `Dan Maas`,
      summary: `I write about systems.`,
    },
    description: `A blog about stuff`,
    siteUrl: `https://drmaas.me`,
    social: {
      github: `https://github.com/drmaas`,
      linkedin: `https://www.linkedin.com/in/daniel-r-maas`,
      twitter: `https://twitter.com/drmaas`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-styled-components`,
    {
      // A Gatsby plugin for sourcing data into your Gatsby application from your local filesystem
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content`,
        fastHash: true,
      },
    },
    {
      // A Gatsby plugin for sourcing data into your Gatsby application from your local filesystem
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
        fastHash: true,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        commonmark: true,
        footnotes: true,
        pedantic: false,
        gfm: true,
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `header-link-icon`
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 600,
              wrapperStyle: `margin: 30px auto;`,
            },
          },
          {
            resolve: `gatsby-remark-embed-video`,
            options: {
              width: 800,
            },
          },
          {
            // Wraps iframes or objects (e.g. embedded YouTube videos) within markdown files in a responsive elastic container with a fixed aspect ratio
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          // Adds syntax highlighting to code blocks in markdown files using PrismJS.
          `gatsby-remark-prismjs`,
          // Adds slack-style emoji to gatsby’s markdown 👍!
          `gatsby-remark-emoji`,
        ],
      },
    },
    // Creates ImageSharp nodes from image types that are supported by the Sharp image processing library and provides fields in their GraphQL types for processing your images in a variety of ways including resizing, cropping, and creating responsive images
    `gatsby-transformer-sharp`,
    // Exposes several image processing functions built on the Sharp image processing library
    `gatsby-plugin-sharp`,
    {
      // Create an RSS feed (or multiple feeds) for your Gatsby site
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.frontmatter.slug,
                  guid: site.siteMetadata.siteUrl + node.frontmatter.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `{
              allMdx(sort: {frontmatter: {date: DESC}}) {
                nodes {
                  excerpt
                  frontmatter {
                    title
                    date
                    slug
                  }
                }
              }
            }`,
            output: "/rss.xml",
            title: "drmaas.me RSS Feed",
          },
        ],
      },
    },
    {
      // The web app manifest (part of the PWA specification) enabled by this plugin allows users to add your site to their home screen on most mobile browsers — see here
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Personal site for Dan Maas`,
        short_name: `Dan Maas`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/bitmoji.jpeg`, // This path is relative to the root of the site.
      },
    },
    // Adds drop-in support for making a Gatsby site work offline and more resistant to bad network connections
    `gatsby-plugin-offline`,
  ],
}
