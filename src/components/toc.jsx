import * as React from "react"

import { Link } from "gatsby"

import styled from "styled-components"

const TocStyle = styled.ul`
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

const InnerScrollStyle = styled.div`
  overflow: hidden;
  overflow-y: scroll;
`

const Toc = ({ prefix, post}) => {
    return typeof post.tableOfContents.items === 'undefined' ? null : (
            <TocStyle>
              <InnerScrollStyle>
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
                <Link to={`${prefix}${post.frontmatter.slug}`}>Back to Top</Link>
              </InnerScrollStyle>
            </TocStyle>
          )
}

export default Toc