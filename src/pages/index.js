import React, { useState, useMemo } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import LanguageCard from '../components/LanguageCard'
import TimelineGraph from '../components/TimelineGraph'
import { CATEGORIES } from '../categories'

const s = {
  hero: {
    textAlign: 'center',
    padding: '3rem 1.5rem 1rem',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '3rem',
    fontWeight: 700,
    color: 'var(--accent)',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    maxWidth: 600,
    margin: '0 auto',
  },
  timelineSection: {
    margin: '2rem 0',
    padding: '0 1.5rem',
  },
  filtersSection: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '1.5rem',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  filterLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    marginRight: '0.5rem',
  },
  filterBtn: (active) => ({
    background: active ? 'var(--tag-bg)' : 'transparent',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    color: active ? 'var(--tag-text)' : 'var(--text-secondary)',
    borderRadius: '16px',
    padding: '0.3em 0.75em',
    fontSize: '0.75rem',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }),
  searchInput: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: "'JetBrains Mono', monospace",
    width: '100%',
    maxWidth: 400,
    outline: 'none',
  },
  grid: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1.5rem 3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  count: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: '1rem',
    maxWidth: 1200,
    margin: '0 auto 1rem',
    padding: '0 1.5rem',
  },
}

export default function IndexPage({ data }) {
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState(new Set())
  const [fragletOnly, setFragletOnly] = useState(false)

  const allLanguages = useMemo(() => {
    return data.allMarkdownRemark.nodes.map(n => n.frontmatter).sort((a, b) => {
      return a.displayName.localeCompare(b.displayName)
    })
  }, [data])

  const timelineData = useMemo(() => {
    return allLanguages
  }, [allLanguages])

  const filtered = useMemo(() => {
    return allLanguages.filter(lang => {
      if (search) {
        const q = search.toLowerCase()
        const match = lang.displayName.toLowerCase().includes(q)
          || lang.slug.toLowerCase().includes(q)
          || (lang.category && lang.category.toLowerCase().includes(q))
        if (!match) return false
      }
      if (activeCategories.size > 0 && !activeCategories.has(lang.category)) return false
      if (fragletOnly && !lang.fragletEnabled) return false
      return true
    })
  }, [allLanguages, search, activeCategories, fragletOnly])

  const toggleCategory = (cat) => {
    setActiveCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  return (
    <Layout>
      <SEO />

      <div style={s.hero}>
        <h1 style={s.title}>100 Hellos</h1>
        <p style={s.subtitle}>
          ~{allLanguages.length} programming languages. Containerized. Executable. Connected.
        </p>
      </div>

      <div style={s.timelineSection}>
        <TimelineGraph languages={timelineData} />
      </div>

      <div id="languages" style={s.filtersSection}>
        <div style={s.filterRow}>
          <input
            type="text"
            placeholder="Search languages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>

        <div style={s.filterRow}>
          <span style={s.filterLabel}>category</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              style={s.filterBtn(activeCategories.has(cat))}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={s.filterRow}>
          <button
            onClick={() => setFragletOnly(!fragletOnly)}
            style={s.filterBtn(fragletOnly)}
          >
            fraglet-enabled only
          </button>
          {activeCategories.size > 0 && (
            <button
              onClick={() => setActiveCategories(new Set())}
              style={{ ...s.filterBtn(false), color: 'var(--text-muted)' }}
            >
              clear filters
            </button>
          )}
        </div>
      </div>

      <div style={s.count}>
        {filtered.length} language{filtered.length !== 1 ? 's' : ''}
      </div>

      <div style={s.grid}>
        {filtered.map(lang => (
          <LanguageCard key={lang.slug} language={lang} />
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query IndexPage {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "languages" } } }
    ) {
      nodes {
        frontmatter {
          slug
          displayName
          year
          category
          paradigm
          influencedBy
          influences
          fragletEnabled
          extensions
        }
      }
    }
  }
`
