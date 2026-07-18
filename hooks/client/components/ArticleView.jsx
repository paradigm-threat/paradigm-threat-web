import React from 'react'
import { MarkdownRenderer } from '@clevertree/markdown'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import { filesBaseUrl } from 'hooks/client/config.jsx'
import manifest from '@hooks'

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

function normalizeRelPath(s) {
  let t = str(s).trim()
  while (t.length > 0 && t.charAt(0) === '/') {
    t = t.slice(1)
  }
  if (t.length === 0) return 'README.md'
  return t
}

function resolveMdHref(href, currentPath, slash, baseUrl) {
  const h = str(href)
  if (h.length === 0) return currentPath
  if (h.indexOf('mailto:') === 0 || h.indexOf('tel:') === 0) return currentPath
  if (h.charAt(0) === '#') return currentPath
  if (h.indexOf('://') >= 0) {
    if (baseUrl && h.indexOf(str(baseUrl)) === 0) {
      const baseLen = str(baseUrl).length
      let rest = h.slice(baseLen)
      while (rest.length > 0 && rest.charAt(0) === '/') {
        rest = rest.slice(1)
      }
      return normalizeRelPath(rest)
    }
    return normalizeRelPath(h)
  }
  if (h.charAt(0) === '/') {
    return normalizeRelPath(h)
  }
  let rel = h
  if (rel.indexOf('./') === 0) rel = rel.slice(2)
  let dir = str(currentPath)
  const lio = dir.lastIndexOf(slash)
  if (lio >= 0) dir = dir.slice(0, lio)
  else dir = ''
  const parts = rel.split(slash)
  const segs = []
  if (dir.length > 0) {
    const dparts = dir.split(slash)
    for (let i = 0; i < dparts.length; i++) {
      if (dparts[i].length > 0) segs.push(dparts[i])
    }
  }
  for (let j = 0; j < parts.length; j++) {
    const p = parts[j]
    if (p.length === 0 || p === '.') {
      /* skip */
    } else if (p === '..') {
      if (segs.length > 0) segs.pop()
    } else {
      segs.push(p)
    }
  }
  let out = ''
  for (let k = 0; k < segs.length; k++) {
    if (k > 0) out = out + slash
    out = out + segs[k]
  }
  return normalizeRelPath(out)
}

function parentDir(relPath, slash) {
  const p = str(relPath)
  const i = p.lastIndexOf(slash)
  if (i <= 0) return 'README.md'
  const up = p.slice(0, i)
  if (up.length === 0) return 'README.md'
  return normalizeRelPath(up)
}

function filesOrigin() {
  if (manifest.relayFilesBaseUrl && typeof manifest.relayFilesBaseUrl === 'string') {
    return manifest.relayFilesBaseUrl
  }
  return filesBaseUrl
}

export default function ArticleView(props) {
  const routePath = props.filePath || 'README.md'
  const onNavigate = props.onNavigate
  const currentPath = props.currentPath || '/README.md'
  const slash = manifest.relayPathSlash ? manifest.relayPathSlash : '/'

  function navigateFile(to) {
    const rel = normalizeRelPath(to)
    const route = '/' + rel
    if (onNavigate) onNavigate(route)
  }

  function onMdLinkClick(href) {
    const h = str(href)
    if (h.charAt(0) === '/' && h.indexOf('://') < 0) {
      if (onNavigate) onNavigate(h)
      return
    }
    const resolved = resolveMdHref(href, routePath, slash, filesOrigin())
    navigateFile(resolved)
  }

  let pathPart = normalizeRelPath(routePath)
  let markdownContent = ''
  let errMsg = ''
  let baseStr = filesOrigin()
  while (baseStr.length > 0 && baseStr.charAt(baseStr.length - 1) === '/') {
    baseStr = baseStr.slice(0, baseStr.length - 1)
  }
  if (baseStr.length === 0) {
    errMsg = 'Missing files origin — set relayFilesBaseUrl or config filesBaseUrl.'
  } else {
    const url = baseStr + slash + pathPart
    const resp = fetch(url, { method: 'GET' })
    if (resp && resp.ok === true) {
      markdownContent = resp.text ? resp.text : ''
    } else {
      let st = 0
      if (resp && resp.status) st = resp.status
      errMsg = 'Could not load file (HTTP ' + st + ')'
    }
  }

  const body = errMsg ? '# Error\n\n' + errMsg : markdownContent

  function onUpClick() {
    navigateFile(parentDir(routePath, slash))
  }

  function onHomeClick() {
    navigateFile('README.md')
  }

  return (
    <SiteChrome currentPath={currentPath} onNavigate={onNavigate}>
      <main className="pt-page pt-article-page">
        <div className="pt-article-toolbar">
          <span className="pt-muted">File:</span>
          <span className="pt-article-path">{pathPart}</span>
          <button type="button" className="pt-btn" onClick={onUpClick}>
            Up
          </button>
          <button type="button" className="pt-btn" onClick={onHomeClick}>
            Home
          </button>
        </div>
        <div className="pt-article-body">
          <MarkdownRenderer content={body} navigate={navigateFile} anchorOnClick={onMdLinkClick} />
        </div>
      </main>
    </SiteChrome>
  )
}
