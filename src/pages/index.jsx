import * as React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import Seo from "../components/seo";

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  // filter for blog posts only
  const blogPattern = /.*\/content\/blog\/.*/;
  const posts = data.allMarkdownRemark.nodes.filter((node) => {
    return blogPattern.test(node.fileAbsolutePath);
  })

  // filter for topics pages
  const topicsPattern = /.*\/content\/topics\/.*/;
  const topics = data.allMarkdownRemark.nodes.filter((node) => {
    return topicsPattern.test(node.fileAbsolutePath);
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
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    { /* custom slug defined on each blog post */ }
                    <Link to={post.frontmatter.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                  {post.timeToRead > 1 ?
                    <small> &#8226; {post.timeToRead} minutes</small> : <small> &#8226; {post.timeToRead} minute</small>
                  }
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
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          slug
          title
          description
        }
        fileAbsolutePath
        timeToRead
      }
    }
  }
`
