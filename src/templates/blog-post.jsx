import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const author = site.siteMetadata?.author.name

  return (
    <Layout location={location} title={siteTitle} author={author}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <Link className="header-link-home" to={post.frontmatter.slug}><h1 itemProp="headline">{post.frontmatter.title}</h1></Link>
          <p>{post.frontmatter.date}
          {post.timeToRead > 1 ?
                    <span> &#8226; {post.timeToRead} minutes</span> : <span> &#8226; {post.timeToRead} minute</span>
                  }
          </p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Link to="/">Back</Link>
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.frontmatter.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.frontmatter.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        slug
        date(formatString: "MMMM DD, YYYY")
        description
      }
      timeToRead
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        slug
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        slug
      }
    }
  }
`