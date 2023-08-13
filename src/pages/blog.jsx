import * as React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"

import Layout from "../components/layout"
import Seo from "../components/seo"

const blogPrefix = '/blog'

const Toc = styled.ul`
  position: fixed;
  left: calc(50% + 400px);
  top: 110px;
  max-height: 70vh;
  width: 310px;
  display: flex;
  li {
    line-height: 10px;
    margin-top: 10px;
  }
`

const InnerScroll = styled.div`
  overflow: hidden;
  overflow-y: scroll;
`

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
          <Link className="header-link-home" to={`${blogPrefix}${post.frontmatter.slug}`}><h1 itemProp="headline">{post.frontmatter.title}</h1></Link>
          <p>{post.frontmatter.date}
            <span> &#8226; {post.fields.timeToRead.text} </span>
          </p>
        </header>
        {typeof post.tableOfContents.items === 'undefined' ? null : (
          <Toc>
            <InnerScroll>
              {/* Note: this only goes 2 levels deep. Think about making it more flexible and resuable. */}
              <h2>Table of contents</h2>
              <ul>
                {post.tableOfContents.items.map(i => (
                  <li key={i.url}>
                    <a href={i.url} key={i.url}>
                      {i.title}
                    </a>
                    <ul>
                      {i.items?.map(i => (
                        <li key={i.url}>
                          <a href={i.url} key={i.url}>
                            {i.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <Link to={`${blogPrefix}${post.frontmatter.slug}`}>Back to Top</Link>
            </InnerScroll>
          </Toc>
        )}
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
              <Link to={`${blogPrefix}${previous.frontmatter.slug}`} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`${blogPrefix}${next.frontmatter.slug}`} rel="next">
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
