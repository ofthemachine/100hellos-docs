import React, { useEffect, useRef } from 'react'

export default function CopyableCode({ html }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const pres = containerRef.current.querySelectorAll('pre')
    pres.forEach(pre => {
      if (pre.querySelector('.copy-btn')) return

      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.textContent = 'copy'
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')
        const text = code ? code.textContent : pre.textContent
        navigator.clipboard.writeText(text)
        btn.textContent = 'copied'
        setTimeout(() => { btn.textContent = 'copy' }, 2000)
      })

      pre.style.position = 'relative'
      pre.appendChild(btn)
    })
  }, [html])

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
