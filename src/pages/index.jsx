import * as React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import Seo from "../components/seo";

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  // filter for blog posts only
  const blogPattern = /.*\/content\/blog\/.*/;
  const posts = data.allMdx.nodes.filter((node) => {
    return !node.frontmatter.hidden && blogPattern.test(node.internal.contentFilePath);
  })

  // filter for topics pages
  const topicsPattern = /.*\/content\/topics\/.*/;
  const topics = data.allMdx.nodes.filter((node) => {
    return !node.frontmatter.hidden && topicsPattern.test(node.internal.contentFilePath);
  }).reduce((map, node) => {
    map[node.frontmatter.slug] = node;
    return map;
  }, {});

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio topics={topics} />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle} author={data.site.siteMetadata?.author.name}>
      <Bio topics={topics} />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {

          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.id}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    { /* custom slug defined on each blog post */ }
                    <Link key={post.id} to={`/blog${post.frontmatter.slug}`} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                  <small> &#8226; {post.fields.timeToRead.text} </small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        author {
          name
          summary
        }
      }
    }
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        excerpt
        fields {
          timeToRead {
            text
          }
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          slug
          title
          description
        }
        internal {
          contentFilePath
        }
      }
    }
  }
`