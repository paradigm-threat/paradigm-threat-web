/**
 * Paradigm Threat web shell — path-based pages (full navigation via href).
 * CleverScript SSR cannot pass local function identifiers into imported components
 * (`onNavigate={routeTo}` → Undefined variable). Use plain links + per-page state.
 */
import React from 'react'
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
  const route = initialRoute()
  let page = null
  if (route === '/' || route === '/index.md') {
    page = <Home currentPath="/" />
  } else if (route === '/search') {
    page = <SearchPage currentPath="/search" />
  } else if (route === '/timeline') {
    page = <TimelinePage currentPath="/timeline" />
  } else {
    page = <ArticleView currentPath={route} filePath={articleFilePath(route)} />
  }

  return (
    <StyleContext src="hooks/client/theme.yaml">
      {page}
    </StyleContext>
  )
}
