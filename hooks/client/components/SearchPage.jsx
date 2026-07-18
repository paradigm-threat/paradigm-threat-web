import React, { useState } from 'react'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import { IconSearch } from 'hooks/client/components/Icons.jsx'
import { filesBaseUrl } from 'hooks/client/config.jsx'

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

function rowTitle(row) {
  if (!row) return 'Untitled'
  if (row._title && typeof row._title === 'string') return row._title
  if (row.title && typeof row.title === 'string') return row.title
  if (row.path && typeof row.path === 'string') return row.path
  return 'Untitled'
}

function rowPath(row) {
  if (!row) return ''
  if (row.path && typeof row.path === 'string') return row.path
  return ''
}

function runSearch(query) {
  let base = filesBaseUrl
  while (base.length > 0 && base.charAt(base.length - 1) === '/') {
    base = base.slice(0, base.length - 1)
  }
  const resp = fetch(base + '/', {
    method: 'QUERY',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({ collection: 'index', query: query, limit: 24 }),
  })
  if (!resp || resp.ok !== true) {
    let st = 0
    if (resp && resp.status) st = resp.status
    return { error: 'Search failed (HTTP ' + st + ')', rows: [] }
  }
  let text = resp.text ? resp.text : ''
  if (text.length === 0) return { error: 'Empty search response', rows: [] }
  try {
    const data = JSON.parse(text)
    if (data && data.results && data.results.length >= 0) {
      return { error: '', rows: data.results }
    }
    return { error: 'Unexpected search envelope', rows: [] }
  } catch (e) {
    return { error: 'Could not parse search response', rows: [] }
  }
}

export default function SearchPage(props) {
  const currentPath = props.currentPath || '/search'
  const onNavigate = props.onNavigate
  const qState = useState('')
  const query = qState[0]
  const setQuery = qState[1]
  const submitted = useState('')
  const submittedQuery = submitted[0]
  const setSubmittedQuery = submitted[1]
  const resultState = useState({ error: '', rows: [] })
  const result = resultState[0]
  const setResult = resultState[1]

  function doSearch() {
    const q = str(query).trim()
    setSubmittedQuery(q)
    if (q.length === 0) {
      setResult({ error: '', rows: [] })
      return
    }
    setResult(runSearch(q))
  }

  return (
    <SiteChrome currentPath={currentPath} onNavigate={onNavigate}>
      <main className="pt-page" id="pt-search">
        <div className="pt-container">
          <header className="pt-header">
            <h1 className="pt-title">Search</h1>
            <p className="pt-muted pt-lead">
              Full-text search over the files corpus (Relay QUERY stub — results from the files mirror).
            </p>
          </header>
          <div className="pt-search-form">
            <input
              className="pt-input"
              type="search"
              value={query}
              placeholder="Search articles and files…"
              onChange={(e) => {
                if (e && e.target && typeof e.target.value === 'string') {
                  setQuery(e.target.value)
                }
              }}
            />
            <button type="button" className="pt-btn pt-btn-primary" onClick={doSearch}>
              <IconSearch />
              <span>Search</span>
            </button>
          </div>
          {submittedQuery.length === 0 ? (
            <p className="pt-muted">Enter a query to search the indexed files corpus.</p>
          ) : null}
          {result.error ? <p className="pt-error">{result.error}</p> : null}
          {submittedQuery.length > 0 && !result.error ? (
            <p className="pt-muted">{result.rows.length} results for "{submittedQuery}"</p>
          ) : null}
          <ul className="pt-result-list">
            {result.rows.map((row, idx) => {
              const path = rowPath(row)
              const href = path.length > 0 ? '/' + path : '/README.md'
              const key = path.length > 0 ? path : 'row-' + idx
              return (
                <li key={key} className="pt-result-item">
                  <a
                    href={href}
                    className="pt-result-link"
                    onClick={() => {
                      if (onNavigate) onNavigate(href)
                    }}
                  >
                    <span className="pt-result-title">{rowTitle(row)}</span>
                    {path.length > 0 ? <span className="pt-muted pt-result-path">{path}</span> : null}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    </SiteChrome>
  )
}
