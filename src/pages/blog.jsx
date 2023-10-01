import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Toc from "../components/toc"

const prefix = '/blog'

const BlogPostTemplate = ({
  data: { previous, next, site, mdx: post },
  location,
  children,
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
          <Link className="header-link-home" to={`${prefix}${post.frontmatter.slug}`}><h1 itemProp="headline">{post.frontmatter.title}</h1></Link>
          <p>{post.frontmatter.date}
            <span> &#8226; {post.fields.timeToRead.text} </span>
          </p>
        </header>
        <Toc prefix={prefix} post={post}/>
        <section itemProp="articleBody">{children}</section>
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
              <Link to={`${prefix}${previous.frontmatter.slug}`} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`${prefix}${next.frontmatter.slug}`} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { mdx: post } }) => {
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
    $id: String
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
    mdx(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      tableOfContents
      body
      fields {
        timeToRead {
          text
        }
      }
      frontmatter {
        title
        slug
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: mdx(id: { eq: $previousPostId }) {
      frontmatter {
        title
        slug
      }
    }
    next: mdx(id: { eq: $nextPostId }) {
      frontmatter {
        title
        slug
      }
    }
  }
`
