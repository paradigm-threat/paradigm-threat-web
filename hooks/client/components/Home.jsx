import React from 'react'
import { IconBook } from 'hooks/client/components/Icons.jsx'

export default function Home(props) {
  const title = props.title || 'Paradigm Threat'
  const blurb = props.blurb || 'Thin-repo canary — CleverScript shell over IPFS-backed files and timeline.'
  return (
    <main className="pt-page" id="pt-home">
      <header className="pt-header">
        <h1 className="pt-title">{title}</h1>
        <p className="pt-muted">{blurb}</p>
        <nav className="pt-nav">
          <a className="pt-chip" href="/README.md"><IconBook /><span>Files corpus</span></a>
          <a className="pt-chip" href="https://paradigmthreat.net" target="_blank" rel="noopener noreferrer">Production site</a>
        </nav>
      </header>
    </main>
  )
}
