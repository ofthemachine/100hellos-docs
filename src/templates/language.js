import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import CopyableCode from '../components/CopyableCode'
import CopyableCommand from '../components/CopyableCommand'

const CATEGORY_COLORS = {
  systems: '#ff6b6b',
  'general-purpose': '#4ecdc4',
  functional: '#a78bfa',
  scripting: '#fbbf24',
  web: '#60a5fa',
  historical: '#9ca3af',
  esoteric: '#f472b6',
  jvm: '#fb923c',
  shell: '#34d399',
  'ml-family': '#c084fc',
}

const s = {
  hero: {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    padding: '2.5rem 0',
  },
  heroInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '0.75rem',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: '2.5rem',
    margin: 0,
  },
  yearBadge: {
    background: 'var(--tag-bg)',
    color: 'var(--tag-text)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.9rem',
    fontWeight: 600,
    padding: '0.3em 0.8em',
    borderRadius: '8px',
  },
  fragletBadge: {
    background: 'var(--accent)',
    color: '#000',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.3em 0.7em',
    borderRadius: '8px',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
  },
  linkBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    fontFamily: "'JetBrains Mono', monospace",
    textDecoration: 'none',
    transition: 'border-color 0.15s ease',
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  connections: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    margin: '0.5rem 0',
  },
  connLink: {
    display: 'inline-block',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '0.25em 0.6em',
    fontSize: '0.8rem',
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--link-color)',
    textDecoration: 'none',
    transition: 'border-color 0.15s ease',
  },
  buildInfo: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginTop: '2rem',
  },
  buildRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.4rem 0',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.85rem',
  },
  buildLabel: {
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  buildValue: {
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-primary)',
  },
  breadcrumb: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0.75rem 1.5rem',
    fontSize: '0.8rem',
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted)',
  },
}

export default function LanguagePage({ data }) {
  const { markdownRemark, allMarkdownRemark } = data
  const fm = markdownRemark.frontmatter
  const [guideOpen, setGuideOpen] = useState(true)

  const allLanguages = allMarkdownRemark.nodes.map(n => n.frontmatter)
  const catColor = CATEGORY_COLORS[fm.category] || '#666'

  const resolveSlug = (name) => {
    const match = allLanguages.find(l => l.slug === name || l.displayName.toLowerCase() === name)
    return match ? match.slug : null
  }

  return (
    <Layout>
      <SEO title={fm.displayName} description={`${fm.displayName} - Hello World in a container`} />

      <div style={s.breadcrumb}>
        <Link to="/" style={{ color: 'var(--link-color)' }}>Home</Link>
        {' / '}
        <Link to="/#languages" style={{ color: 'var(--link-color)' }}>Languages</Link>
        {' / '}
        <span style={{ color: 'var(--text-primary)' }}>{fm.displayName}</span>
      </div>

      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.titleRow}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: catColor, flexShrink: 0 }} />
            <h1 style={s.title}>{fm.displayName}</h1>
            {fm.year && <span style={s.yearBadge}>{fm.year}</span>}
            {fm.fragletEnabled && <span style={s.fragletBadge}>fraglet</span>}
          </div>

          <div style={s.meta}>
            <span className="tag">{fm.category}</span>
            {fm.paradigm.map(p => <span className="badge" key={p}>{p}</span>)}
            {fm.extensions.map(ext => <span className="badge" key={ext}>{ext}</span>)}
          </div>

          <div style={s.links}>
            <a href={fm.dockerhubUrl} target="_blank" rel="noopener noreferrer" style={s.linkBtn}>
              DockerHub
            </a>
            <a href={fm.githubUrl} target="_blank" rel="noopener noreferrer" style={s.linkBtn}>
              GitHub Source
            </a>
          </div>

          <CopyableCommand command={`docker run --rm --platform="linux/amd64" ${fm.container}`} />
        </div>
      </div>

      <div style={s.content}>
        <CopyableCode html={markdownRemark.html} />

        {(fm.influencedBy.length > 0 || fm.influences.length > 0) && (
          <div style={{ marginTop: '2rem' }}>
            <h2>Connections</h2>
            {fm.influencedBy.length > 0 && (
              <div style={{ margin: '1rem 0' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  influenced by
                </div>
                <div style={s.connections}>
                  {fm.influencedBy.map(name => {
                    const slug = resolveSlug(name)
                    return slug
                      ? <Link key={name} to={`/languages/${slug}`} style={s.connLink}>{name}</Link>
                      : <span key={name} style={{ ...s.connLink, color: 'var(--text-muted)' }}>{name}</span>
                  })}
                </div>
              </div>
            )}
            {fm.influences.length > 0 && (
              <div style={{ margin: '1rem 0' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  influences
                </div>
                <div style={s.connections}>
                  {fm.influences.map(name => {
                    const slug = resolveSlug(name)
                    return slug
                      ? <Link key={name} to={`/languages/${slug}`} style={s.connLink}>{name}</Link>
                      : <span key={name} style={{ ...s.connLink, color: 'var(--text-muted)' }}>{name}</span>
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={s.buildInfo}>
          <h3 style={{ marginTop: 0, fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace" }}>Container Info</h3>
          <div style={s.buildRow}>
            <span style={s.buildLabel}>image</span>
            <span style={s.buildValue}>{fm.container}</span>
          </div>
          {fm.buildDay && (
            <div style={s.buildRow}>
              <span style={s.buildLabel}>build schedule</span>
              <span style={s.buildValue}>{fm.buildDay}</span>
            </div>
          )}
          <div style={s.buildRow}>
            <span style={s.buildLabel}>fraglet</span>
            <span style={s.buildValue}>{fm.fragletEnabled ? 'enabled' : 'no'}</span>
          </div>
          <div style={{ ...s.buildRow, borderBottom: 'none' }}>
            <span style={s.buildLabel}>source</span>
            <a href={fm.githubUrl} style={{ ...s.buildValue, color: 'var(--link-color)' }}>{fm.dirName}/files/</a>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query LanguagePage($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
        displayName
        dirName
        container
        extensions
        year
        paradigm
        influencedBy
        influences
        category
        dockerhubUrl
        githubUrl
        helloWorldFile
        hasGuide
        hasVeinsTest
        fragletEnabled
        buildDay
      }
    }
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "languages" } } }
    ) {
      nodes {
        frontmatter {
          slug
          displayName
        }
      }
    }
  }
`
