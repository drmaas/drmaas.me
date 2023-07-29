import * as React from "react"
import { Link } from "gatsby"
import { MDXProvider } from "@mdx-js/react";

const Layout = ({ location, title, author, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  const footer = (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {`
    © ${new Date().getFullYear()} ${author}

    Built with `
      } <a href="https://www.gatsbyjs.com">Gatsby</a></div>
  )

  return (
    <MDXProvider>
      <div className="global-wrapper" data-is-root-path={isRootPath}>
        <header className="global-header">{header}</header>
        <main>{children}</main>
        <footer>{footer}</footer>
      </div>
    </MDXProvider>
  )
}

export default Layout
