/**
 * Paradigm Threat web shell — client GET hook with path-based routing.
 * CleverScript: no global String() — coerce with '' + value or typeof checks.
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

function isArticleRoute(route) {
  if (route === '/') return false
  if (route === '/search') return false
  if (route === '/timeline') return false
  return true
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

  function go(to) {
    const next = normalizeRoute(to)
    setRoute(next)
    try {
      if (typeof navigate === 'function') navigate(next)
    } catch (e) {
      /* host navigate optional */
    }
  }

  let page = null
  if (route === '/' || route === '/index.md') {
    page = <Home currentPath={route} onNavigate={go} />
  } else if (route === '/search') {
    page = <SearchPage currentPath={route} onNavigate={go} />
  } else if (route === '/timeline') {
    page = <TimelinePage currentPath={route} onNavigate={go} />
  } else if (isArticleRoute(route)) {
    page = (
      <ArticleView
        currentPath={route}
        filePath={articleFilePath(route)}
        onNavigate={go}
      />
    )
  } else {
    page = <Home currentPath="/" onNavigate={go} />
  }

  return (
    <StyleContext src="hooks/client/theme.yaml">
      {page}
    </StyleContext>
  )
}
