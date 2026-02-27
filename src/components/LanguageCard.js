import React from 'react'
import { Link } from 'gatsby'
import { CATEGORY_COLORS } from '../categories'

const styles = {
  card: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.25rem',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  name: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
  },
  year: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
    marginTop: '0.5rem',
  },
  fragletBadge: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent)',
  },
  categoryDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '0.4rem',
    flexShrink: 0,
  },
}

export default function LanguageCard({ language }) {
  const { slug, displayName, year, category, paradigm, fragletEnabled } = language

  const catColor = CATEGORY_COLORS[category] || '#666'

  return (
    <Link to={`/languages/${slug}`} style={styles.card} className="language-card">
      {fragletEnabled && <div style={styles.fragletBadge} title="fraglet-enabled" />}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ ...styles.categoryDot, background: catColor }} />
          <span style={styles.name}>{displayName}</span>
        </div>
        <span style={styles.year}>{year || '?'}</span>
      </div>
      <div style={styles.tags}>
        <span className="tag">{category}</span>
        {paradigm && paradigm.slice(0, 2).map(p => (
          <span className="badge" key={p}>{p}</span>
        ))}
      </div>
    </Link>
  )
}
