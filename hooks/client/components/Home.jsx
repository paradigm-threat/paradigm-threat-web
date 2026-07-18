import React from 'react'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import { IconBook, IconClock, IconSearch } from 'hooks/client/components/Icons.jsx'

function Chip(props) {
  const href = props.href
  const label = props.label
  const icon = props.icon
  const onNavigate = props.onNavigate
  function onClick() {
    if (onNavigate) onNavigate(href)
  }
  return (
    <a href={href} className="pt-chip" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </a>
  )
}

export default function Home(props) {
  const title = props.title || 'Paradigm Threat'
  const blurb =
    props.blurb ||
    'Thin-repo canary — CleverScript shell over IPFS-backed files and timeline corpora on Relay.'
  const currentPath = props.currentPath || '/'
  const onNavigate = props.onNavigate

  return (
    <SiteChrome currentPath={currentPath} onNavigate={onNavigate}>
      <main className="pt-page" id="pt-home">
        <div className="pt-container">
          <header className="pt-header">
            <h1 className="pt-title">{title}</h1>
            <p className="pt-muted pt-lead">{blurb}</p>
            <nav className="pt-nav-chips">
              <Chip href="/README.md" label="Files corpus" icon={<IconBook />} onNavigate={onNavigate} />
              <Chip href="/search" label="Search" icon={<IconSearch />} onNavigate={onNavigate} />
              <Chip href="/timeline" label="Timeline" icon={<IconClock />} onNavigate={onNavigate} />
            </nav>
          </header>
        </div>
      </main>
    </SiteChrome>
  )
}
