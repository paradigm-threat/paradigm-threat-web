import React from 'react'
import Nav from 'hooks/client/components/Nav.jsx'
import { propStr } from 'hooks/client/propOr.jsx'

export default function SiteChrome(props) {
  const currentPath = propStr(props, 'currentPath', '/')
  const children = props.children
  return (
    <div className="pt-shell">
      <Nav currentPath={currentPath} />
      {children}
      <footer className="pt-footer">
        <p className="pt-muted">
          Canary on Relay — thin files + timeline over IPFS. Production remains at{' '}
          <a href="https://paradigmthreat.net" target="_blank" rel="noopener noreferrer">
            paradigmthreat.net
          </a>
          .
        </p>
      </footer>
    </div>
  )
}
