import React from 'react'
import { Link } from 'gatsby'
import ThemeToggle from './ThemeToggle'

const styles = {
  header: {
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(8px)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0.75rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'var(--text-primary)',
  },
  logo: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: '1.25rem',
    color: 'var(--accent)',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontFamily: "'JetBrains Mono', monospace",
  },
}

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.logo}>100 Hellos</span>
          <span style={styles.subtitle}>languages</span>
        </Link>
        <nav style={styles.nav}>
          <a
            href="https://hub.docker.com/u/100hellos"
            style={styles.navLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            DockerHub
          </a>
          <a
            href="https://github.com/ofthemachine/100hellos"
            style={styles.navLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
