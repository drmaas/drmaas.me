/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// Define the template for blog post
const blog = path.resolve(`./src/pages/blog.jsx`)
const other = path.resolve(`./src/pages/other.jsx`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMdx(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          frontmatter {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  const isBlog = (post) => {
    return post.internal.contentFilePath.indexOf('blog') > 0;
  };

  const posts = result.data.allMdx.nodes.filter((node) => isBlog(node));

  if (posts.length > 0) {
    posts.forEach((node, index) => {
      // only link to blog posts
      const previousPostId = index > 0 && isBlog(node) && isBlog(posts[index - 1]) ? posts[index - 1].id : null
      const nextPostId = index < posts.length - 1 && isBlog(node) && isBlog(posts[index + 1]) ? posts[index + 1].id : null

      createPage({
        // custom slug defined on each blog post
        path: `/blog${node.frontmatter.slug}`,
        component: `${blog}?__contentFilePath=${node.internal.contentFilePath}`,
        context: {
          id: node.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  const others = result.data.allMdx.nodes.filter((node) => !isBlog(node));

  if (others.length > 0) {
    others.forEach((node) => {
      createPage({
        // custom slug defined on each blog post
        path: node.frontmatter.slug,
        component: `${other}?__contentFilePath=${node.internal.contentFilePath}`,
        context: {
          id: node.id,
        },
      })
    })
  }

}

const readingTime = require(`reading-time`)

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    createNodeField({
      node,
      name: `timeToRead`,
      value: readingTime(node.body)
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }
  `)
}
