import React from 'react'

const SITE_URL = 'https://100hellos.ofthemachine.com'

function feedbackUrl(path) {
  const pageUrl = `${SITE_URL}${path}`
  const params = new URLSearchParams({
    template: 'page-feedback.yml',
    title: `[Feedback] ${path}`,
    url: pageUrl,
  })
  return `https://github.com/ofthemachine/100hellos-docs/issues/new?${params}`
}

const styles = {
  footer: {
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    padding: '2rem 1.5rem',
    marginTop: '4rem',
    textAlign: 'center',
  },
  text: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'none',
  },
}

export default function Footer() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        <a href="https://github.com/ofthemachine/100hellos" style={styles.link} target="_blank" rel="noopener noreferrer">
          100hellos
        </a>
        {' + '}
        <a href="https://github.com/ofthemachine/fraglet" style={styles.link} target="_blank" rel="noopener noreferrer">
          fraglet
        </a>
        {' · '}
        <a href={feedbackUrl(path)} style={styles.link} target="_blank" rel="noopener noreferrer">
          Suggest Changes
        </a>
      </p>
    </footer>
  )
}
