/**
 * Paradigm Threat web shell — client GET hook with path-based routing.
 * CleverScript: no global String() — coerce with '' + value or typeof checks.
 * Do not reference undeclared host globals (e.g. navigate) — that breaks SSR IR.
 */
import React, { useState } from 'react'
import StyleContext from '@clevertree/style'
import manifest from '@hooks'
import Home from 'hooks/client/components/Home.jsx'
import SearchPage from 'hooks/client/components/SearchPage.jsx'
import TimelinePage from 'hooks/client/components/TimelinePage.jsx'
import ArticleView from 'hooks/client/components/ArticleView.jsx'

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

function normalizeRoute(raw) {
  let t = str(raw).trim()
  if (t.length === 0) return '/'
  if (t.charAt(0) !== '/') t = '/' + t
  if (t === '/index.md') return '/'
  return t
}

function initialRoute() {
  if (manifest.relayInitialPath && typeof manifest.relayInitialPath === 'string') {
    return normalizeRoute(manifest.relayInitialPath)
  }
  return '/'
}

function articleFilePath(route) {
  let t = normalizeRoute(route)
  if (t.charAt(0) === '/') t = t.slice(1)
  if (t.length === 0) return 'README.md'
  return t
}

export default function ParadigmThreatWebGet() {
  const routeState = useState(initialRoute())
  const route = routeState[0]
  const setRoute = routeState[1]

  function routeTo(to) {
    setRoute(normalizeRoute(to))
  }

  let page = null
  if (route === '/' || route === '/index.md') {
    page = <Home currentPath={route} onNavigate={routeTo} />
  } else if (route === '/search') {
    page = <SearchPage currentPath={route} onNavigate={routeTo} />
  } else if (route === '/timeline') {
    page = <TimelinePage currentPath={route} onNavigate={routeTo} />
  } else {
    page = (
      <ArticleView
        currentPath={route}
        filePath={articleFilePath(route)}
        onNavigate={routeTo}
      />
    )
  }

  return (
    <StyleContext src="hooks/client/theme.yaml">
      {page}
    </StyleContext>
  )
}
