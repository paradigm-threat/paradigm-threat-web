import React from 'react'
import Nav from 'hooks/client/components/Nav.jsx'

export default function SiteChrome(props) {
  const children = props.children
  const currentPath = props.currentPath
  const onNavigate = props.onNavigate
  const year = props.year || '2026'

  return (
    <div className="pt-shell">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="pt-shell-body">{children}</div>
      <footer className="pt-footer">
        <p className="pt-muted">
          CleverScript canary shell ·{' '}
          <a className="pt-link" href="https://paradigmthreat.net" target="_blank" rel="noopener noreferrer">
            paradigmthreat.net
          </a>
          {' · © ' + year}
        </p>
      </footer>
    </div>
  )
}
