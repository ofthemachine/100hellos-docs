import React, { useState } from 'react'

const styles = {
  wrapper: {
    position: 'relative',
    marginBottom: '1rem',
  },
  copyBtn: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-secondary)',
    transition: 'all 0.15s ease',
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: '0.25rem',
  },
}

export default function CodeBlock({ code, language, label }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={styles.wrapper}>
      {label && <div style={styles.label}>{label}</div>}
      <div style={{ position: 'relative' }}>
        <button onClick={handleCopy} style={styles.copyBtn}>
          {copied ? 'copied' : 'copy'}
        </button>
        <pre>
          <code className={`language-${language || 'text'}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}
