import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const OtherTemplate = ({
  data: { site, mdx: post },
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
          <Link className="header-link-home" to={post.frontmatter.slug}><h1 itemProp="headline">{post.frontmatter.title}</h1></Link>
        </header>
        <section itemProp="articleBody">{children}</section>
        <hr />
        <footer>
          <Link to="/">Back</Link>
        </footer>
      </article>
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

export default OtherTemplate

export const pageQuery = graphql`
  query OtherPostBySlug(
    $id: String
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
  }
`
