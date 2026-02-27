import React, { useRef, useEffect, useState, useCallback } from 'react'
import { navigate } from 'gatsby'
import '../styles/timeline.css'
import { CATEGORY_COLORS, CATEGORY_LANES, CATEGORIES } from '../categories'

export default function TimelineGraph({ languages }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const [activeCategories, setActiveCategories] = useState(new Set(CATEGORIES))
  const [dimensions, setDimensions] = useState({ width: 1200, height: 450 })

  const toggleCategory = (cat) => {
    setActiveCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const renderGraph = useCallback(() => {
    const d3 = require('d3')
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 30, right: 40, bottom: 40, left: 40 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const filtered = languages.filter(l => l.year && activeCategories.has(l.category))
    const slugMap = new Map(languages.map(l => [l.slug, l]))

    const yearExtent = d3.extent(filtered, d => d.year)
    const xScale = d3.scaleLinear()
      .domain([Math.min(yearExtent[0] || 1957, 1955), Math.max(yearExtent[1] || 2025, 2026)])
      .range([0, width])

    const activeLanes = [...new Set(filtered.map(l => CATEGORY_LANES[l.category] ?? 5))]
    activeLanes.sort((a, b) => a - b)
    const laneScale = d3.scaleBand()
      .domain(activeLanes)
      .range([0, height])
      .padding(0.3)

    const jitterMap = new Map()
    const yearBuckets = new Map()
    for (const lang of filtered) {
      const key = `${lang.year}-${lang.category}`
      if (!yearBuckets.has(key)) yearBuckets.set(key, [])
      yearBuckets.get(key).push(lang.slug)
    }
    for (const [, slugs] of yearBuckets) {
      slugs.forEach((slug, i) => {
        jitterMap.set(slug, (i - (slugs.length - 1) / 2) * 14)
      })
    }

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const decades = d3.range(1960, 2030, 10)
    g.selectAll('.decade-line')
      .data(decades)
      .join('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'var(--graph-axis)')
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.3)

    g.selectAll('.decade-label')
      .data(decades)
      .join('text')
      .attr('x', d => xScale(d))
      .attr('y', height + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--graph-axis)')
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('font-size', '11px')
      .text(d => d)

    const getPos = (lang) => {
      const lane = CATEGORY_LANES[lang.category] ?? 5
      const x = xScale(lang.year)
      const y = (laneScale(lane) || 0) + laneScale.bandwidth() / 2 + (jitterMap.get(lang.slug) || 0)
      return { x, y }
    }

    const links = []
    for (const lang of filtered) {
      if (!lang.influencedBy) continue
      for (const inf of lang.influencedBy) {
        const source = slugMap.get(inf)
        if (!source || !source.year || !activeCategories.has(source.category)) continue
        links.push({ source, target: lang })
      }
    }

    const linkGen = d3.linkHorizontal()
      .x(d => d.x)
      .y(d => d.y)

    g.selectAll('.timeline-link')
      .data(links)
      .join('path')
      .attr('class', 'timeline-link')
      .attr('d', d => {
        const s = getPos(d.source)
        const t = getPos(d.target)
        return linkGen({ source: s, target: t })
      })
      .attr('stroke', d => CATEGORY_COLORS[d.source.category] || '#666')
      .attr('stroke-width', 1)
      .attr('opacity', 0.2)
      .attr('data-source', d => d.source.slug)
      .attr('data-target', d => d.target.slug)

    const influenceCount = new Map()
    for (const lang of languages) {
      const count = (lang.influences || []).length
      influenceCount.set(lang.slug, count)
    }

    const nodes = g.selectAll('.timeline-node')
      .data(filtered)
      .join('g')
      .attr('class', 'timeline-node')
      .attr('transform', d => {
        const pos = getPos(d)
        return `translate(${pos.x},${pos.y})`
      })

    const rScale = d3.scaleSqrt().domain([0, 15]).range([4, 14]).clamp(true)

    nodes.append('circle')
      .attr('r', d => rScale(influenceCount.get(d.slug) || 0))
      .attr('fill', d => CATEGORY_COLORS[d.category] || '#666')
      .attr('fill-opacity', 0.7)
      .attr('stroke', d => CATEGORY_COLORS[d.category] || '#666')
      .attr('stroke-width', 1.5)

    nodes.append('text')
      .attr('dy', d => rScale(influenceCount.get(d.slug) || 0) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--graph-label)')
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('font-size', '9px')
      .text(d => d.displayName.length > 12 ? d.displayName.slice(0, 10) + '..' : d.displayName)

    const tooltip = d3.select(tooltipRef.current)

    nodes
      .on('mouseenter', function (event, d) {
        d3.select(this).select('circle').attr('stroke-width', 3)

        g.selectAll('.timeline-link')
          .attr('opacity', link => {
            const ld = d3.select(link).datum ? null : null
            return 0.05
          })

        g.selectAll('.timeline-link')
          .filter(function () {
            const src = d3.select(this).attr('data-source')
            const tgt = d3.select(this).attr('data-target')
            return src === d.slug || tgt === d.slug
          })
          .attr('opacity', 0.6)
          .attr('stroke-width', 2)

        g.selectAll('.timeline-node')
          .attr('opacity', function (nd) {
            if (nd.slug === d.slug) return 1
            if (d.influencedBy && d.influencedBy.includes(nd.slug)) return 1
            if (d.influences && d.influences.includes(nd.slug)) return 1
            return 0.15
          })

        const rect = containerRef.current.getBoundingClientRect()
        const svgRect = svgRef.current.getBoundingClientRect()
        const pos = getPos(d)
        tooltip
          .style('left', `${pos.x + margin.left + 10}px`)
          .style('top', `${pos.y + margin.top - 10}px`)
          .classed('visible', true)
          .html(`
            <div class="timeline-tooltip-name">${d.displayName}</div>
            <div class="timeline-tooltip-meta">${d.year} · ${d.category}</div>
            ${d.paradigm ? `<div class="timeline-tooltip-meta">${d.paradigm.join(', ')}</div>` : ''}
          `)
      })
      .on('mouseleave', function () {
        d3.select(this).select('circle').attr('stroke-width', 1.5)
        g.selectAll('.timeline-link').attr('opacity', 0.2).attr('stroke-width', 1)
        g.selectAll('.timeline-node').attr('opacity', 1)
        tooltip.classed('visible', false)
      })
      .on('click', (event, d) => {
        navigate(`/languages/${d.slug}`)
      })
  }, [languages, activeCategories, dimensions])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        setDimensions({ width: w, height: Math.max(400, Math.min(w * 0.4, 500)) })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    renderGraph()
  }, [renderGraph])

  return (
    <div className="timeline-container" ref={containerRef}>
      <div className="timeline-controls">
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginRight: '0.25rem' }}>
          filter
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`timeline-control-btn ${activeCategories.has(cat) ? 'active' : ''}`}
            onClick={() => toggleCategory(cat)}
            style={{ borderColor: activeCategories.has(cat) ? CATEGORY_COLORS[cat] : undefined }}
          >
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: CATEGORY_COLORS[cat], marginRight: 4 }} />
            {cat}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        className="timeline-svg"
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      />

      <div ref={tooltipRef} className="timeline-tooltip" />
    </div>
  )
}
