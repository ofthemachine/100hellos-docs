import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import CopyableCode from '../components/CopyableCode'

const CURSOR_DEEP_LINK = 'cursor://anysphere.cursor-deeplink/mcp/install?name=fraglet&config=eyJjb21tYW5kIjoiZnJhZ2xldGMiLCJhcmdzIjpbIm1jcCJdfQ=='

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
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: '2.5rem',
    margin: 0,
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '1rem',
    margin: 0,
  },
  quickActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.7rem 1.2rem',
    borderRadius: '8px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
    border: 'none',
  },
  primaryBtn: {
    background: 'var(--accent)',
    color: '#000',
  },
  secondaryBtn: {
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  breadcrumb: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0.75rem 1.5rem',
    fontSize: '0.8rem',
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted)',
  },
  installCmd: {
    position: 'relative',
    background: 'var(--code-bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginTop: '1rem',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    color: 'var(--accent)',
    overflow: 'auto',
  },
}

export default function InstallPage({ data }) {
  const { markdownRemark } = data
  const [copied, setCopied] = useState(false)

  const installCmd = 'curl -fsSL https://raw.githubusercontent.com/ofthemachine/fraglet/main/install.sh | sh'

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Layout>
      <SEO title="Install fragletc" description="Install fragletc — run code fragments in containers with MCP support for Claude and Cursor" />

      <div style={s.breadcrumb}>
        <Link to="/" style={{ color: 'var(--link-color)' }}>Home</Link>
        {' / '}
        <span style={{ color: 'var(--text-primary)' }}>Install</span>
      </div>

      <div style={s.hero}>
        <div style={s.heroInner}>
          <h1 style={s.title}>fragletc</h1>
          <p style={s.subtitle}>Run code fragments in 90+ language containers. Ships with built-in MCP server.</p>

          <div style={s.installCmd}>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? 'copied' : 'copy'}
            </button>
            {installCmd}
          </div>

          <div style={s.quickActions}>
            <a href={CURSOR_DEEP_LINK} style={{ ...s.actionBtn, ...s.primaryBtn }}>
              Install in Cursor
            </a>
            <a
              href="https://github.com/ofthemachine/fraglet/releases"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...s.actionBtn, ...s.secondaryBtn }}
            >
              GitHub Releases
            </a>
            <a
              href="https://github.com/ofthemachine/fraglet"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...s.actionBtn, ...s.secondaryBtn }}
            >
              Source
            </a>
          </div>
        </div>
      </div>

      <div style={s.content}>
        <CopyableCode html={markdownRemark.html} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query InstallPage {
    markdownRemark(
      fields: { sourceInstanceName: { eq: "pages" } }
      frontmatter: { slug: { eq: "install" } }
    ) {
      html
    }
  }
`
