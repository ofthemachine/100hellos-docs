import React, { useState } from 'react'

export default function CopyableCommand({ command }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="copyable-command"
      style={{
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
      }}
    >
      <button
        className="copy-btn"
        onClick={handleCopy}
      >
        {copied ? 'copied' : 'copy'}
      </button>
      {command}
    </div>
  )
}
