/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            github
            linkedin
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div className="bio">
        <StaticImage
          className="bio-avatar"
          layout="fixed"
          formats={["auto", "webp", "avif"]}
          src="../images/profile-pic.jpg"
          width={200}
          height={200}
          quality={95}
          alt="Profile picture"
        />
      </div>
      <div>
        {author?.name && (
          <p>
            <div>
              Written by <strong>{author.name}</strong>{`. `} 
            </div>
            <div>
              {author.summary || null}
            </div>
            <div class="line-break"></div>
            <div>
              <a
                href={`${social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "10px" }}
              >
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
              <a
                href={`${social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "10px" }}
              >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
              <a
                href={`${social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
            </div>
          </p>
        )}
      </div>
    </div>
  )
}

export default Bio
