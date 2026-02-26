import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

const s = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: '2rem',
  },
  code: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '6rem',
    fontWeight: 700,
    color: 'var(--accent)',
    lineHeight: 1,
  },
  message: {
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
    margin: '1rem 0 2rem',
  },
  link: {
    display: 'inline-block',
    background: 'var(--bg-surface)',
    border: '1px solid var(--accent)',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    color: 'var(--accent)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.9rem',
    textDecoration: 'none',
  },
}

export default function NotFoundPage() {
  return (
    <Layout>
      <SEO title="404" />
      <div style={s.wrapper}>
        <div style={s.code}>404</div>
        <p style={s.message}>This language hasn't been containerized yet.</p>
        <Link to="/" style={s.link}>Back to all languages</Link>
      </div>
    </Layout>
  )
}
