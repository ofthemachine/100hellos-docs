import React from 'react'
import { useTheme } from '../context/ThemeContext'

const styles = {
  button: {
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '0.4rem 0.6rem',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontSize: '1.1rem',
    lineHeight: 1,
    transition: 'border-color 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.7rem',
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted)',
  },
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={styles.button}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀' : '☾'}
      <span style={styles.label}>{theme}</span>
    </button>
  )
}
