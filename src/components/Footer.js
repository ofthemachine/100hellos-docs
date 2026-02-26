import React from 'react'

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
      </p>
    </footer>
  )
}
