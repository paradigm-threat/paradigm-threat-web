import React from 'react'
import { MarkdownRenderer } from '@clevertree/markdown'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import { timelineBaseUrl } from 'hooks/client/config.jsx'

function str(v) {
  if (v === null) return ''
  if (typeof v === 'boolean') {
    if (v) return 'true'
    return 'false'
  }
  if (typeof v === 'number') return '' + v
  if (typeof v === 'string') return v
  return ''
}

function eventTitle(row) {
  if (!row) return 'Event'
  if (row.title && typeof row.title === 'string') return row.title
  if (row.name && typeof row.name === 'string') return row.name
  if (row.id && typeof row.id === 'string') return row.id
  return 'Event'
}

function eventMeta(row) {
  if (!row) return ''
  if (row.md_path && typeof row.md_path === 'string') return row.md_path
  if (row.type && typeof row.type === 'string') return row.type
  return ''
}

function loadTimelineIntro() {
  let base = timelineBaseUrl
  while (base.length > 0 && base.charAt(base.length - 1) === '/') {
    base = base.slice(0, base.length - 1)
  }
  const resp = fetch(base + '/README.md', { method: 'GET' })
  if (resp && resp.ok === true && resp.text) return resp.text
  return '# Timeline\n\nBrowse chronology events from the timeline corpus (stub list below).'
}

function flattenEvents(rows) {
  const out = []
  if (!rows || rows.length === 0) return out
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (row.introArticles && row.introArticles.length > 0) {
      for (let j = 0; j < row.introArticles.length; j++) {
        out.push(row.introArticles[j])
      }
    }
    if (row.title && row.id && str(row.id).indexOf('__') !== 0) {
      out.push(row)
    }
    if (row.children && row.children.length > 0) {
      for (let k = 0; k < row.children.length; k++) {
        out.push(row.children[k])
        if (out.length >= 40) break
      }
    }
    if (out.length >= 40) break
  }
  return out.slice(0, 40)
}

function loadTimelineEvents() {
  let base = timelineBaseUrl
  while (base.length > 0 && base.charAt(base.length - 1) === '/') {
    base = base.slice(0, base.length - 1)
  }
  const resp = fetch(base + '/', {
    method: 'QUERY',
    body: JSON.stringify({ collection: 'index', query: '', limit: 40, order: 'sort_key' }),
  })
  if (!resp || resp.ok !== true) return []
  const text = resp.text ? resp.text : ''
  if (text.length === 0) return []
  try {
    const data = JSON.parse(text)
    if (data && data.results) return flattenEvents(data.results)
  } catch (e) {
    return []
  }
  return []
}

function EventItem(props) {
  const row = props.row
  const title = eventTitle(row)
  const meta = eventMeta(row)
  return (
    <li className="pt-event-item">
      <span className="pt-event-title">{title}</span>
      {meta.length > 0 ? <span className="pt-muted pt-event-meta">{meta}</span> : null}
    </li>
  )
}

export default function TimelinePage(props) {
  const currentPath = props.currentPath || '/timeline'
  const intro = loadTimelineIntro()
  const events = loadTimelineEvents()
  const items = []
  for (let i = 0; i < events.length; i++) {
    items.push(<EventItem key={'ev-' + i} row={events[i]} />)
  }

  return (
    <SiteChrome currentPath={currentPath}>
      <main className="pt-page" id="pt-timeline">
        <div className="pt-container">
          <header className="pt-header">
            <h1 className="pt-title">Timeline</h1>
          </header>
          <div className="pt-card pt-timeline-intro">
            <MarkdownRenderer content={intro} />
          </div>
          <section className="pt-section">
            <h2 className="pt-section-title">Recent events (stub)</h2>
            {events.length === 0 ? (
              <p className="pt-muted">No indexed events returned from the timeline mirror yet.</p>
            ) : (
              <ul className="pt-event-list">{items}</ul>
            )}
          </section>
        </div>
      </main>
    </SiteChrome>
  )
}
