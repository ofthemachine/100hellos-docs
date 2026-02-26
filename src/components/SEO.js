import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

export default function SEO({ title, description }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  const metaTitle = title
    ? `${title} | ${site.siteMetadata.title}`
    : site.siteMetadata.title

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <html lang="en" />
    </Helmet>
  )
}
