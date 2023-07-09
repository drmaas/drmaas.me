/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Mind of Maas`,
    author: {
      name: `Daniel Robert Maas`,
      summary: `I write words and think thoughts.`,
    },
    description: `A blog about many things in life`,
    siteUrl: `https://drmaas.me`,
    social: {
      github: `https://github.com/drmaas`,
      linkedin: `https://www.linkedin.com/in/daniel-r-maas`,
      twitter: `https://twitter.com/drmaas`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      // A Gatsby plugin for sourcing data into your Gatsby application from your local filesystem
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `blog`,
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
      // Parses Markdown files using remark
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            // Processes images in markdown so they can be used in the production build
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
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
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `{
              allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
                nodes {
                  excerpt
                  html
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    date
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
