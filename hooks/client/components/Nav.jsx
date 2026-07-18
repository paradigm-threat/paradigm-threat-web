import React, { useState } from 'react'
import ThemeToggle from 'hooks/client/components/ThemeToggle.jsx'
import { IconBook, IconClock, IconClose, IconHome, IconMenu, IconSearch } from 'hooks/client/components/Icons.jsx'

function NavLink(props) {
  const href = props.href
  const label = props.label
  const icon = props.icon
  const active = props.active
  const className = active ? 'pt-nav-link pt-nav-link-active' : 'pt-nav-link'
  return (
    <a href={href} className={className}>
      {icon}
      <span>{label}</span>
    </a>
  )
}

export default function Nav(props) {
  const currentPath = props.currentPath || '/'
  const menu = useState(false)
  const isOpen = menu[0]
  const setOpen = menu[1]

  function isActive(href) {
    if (href === '/') {
      return currentPath === '/' || currentPath === '/index.md'
    }
    return currentPath === href
  }

  return (
    <header className="pt-site-nav" data-site-navbar="true">
      <div className="pt-nav-inner">
        <div className="pt-nav-brand-row">
          <a href="/" className="pt-brand">
            Paradigm Threat
          </a>
          <nav className="pt-nav-desktop md:pt-nav-desktop-md">
            <NavLink href="/" label="Home" icon={<IconHome />} active={isActive('/')} />
            <NavLink href="/search" label="Search" icon={<IconSearch />} active={isActive('/search')} />
            <NavLink href="/timeline" label="Timeline" icon={<IconClock />} active={isActive('/timeline')} />
            <NavLink href="/README.md" label="Files" icon={<IconBook />} active={isActive('/README.md')} />
          </nav>
        </div>
        <div className="pt-nav-actions">
          <div className="pt-nav-actions-desktop md:pt-nav-actions-desktop-md">
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="pt-icon-btn pt-nav-menu-btn md:pt-nav-menu-btn-md"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => {
              setOpen(!isOpen)
            }}
          >
            {isOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      {isOpen ? (
        <div className="pt-nav-mobile md:pt-nav-mobile-md">
          <div className="pt-nav-mobile-tools">
            <span className="pt-nav-mobile-label">Display</span>
            <ThemeToggle />
          </div>
          <nav className="pt-nav-mobile-links">
            <NavLink href="/" label="Home" icon={<IconHome />} active={isActive('/')} />
            <NavLink href="/search" label="Search" icon={<IconSearch />} active={isActive('/search')} />
            <NavLink href="/timeline" label="Timeline" icon={<IconClock />} active={isActive('/timeline')} />
            <NavLink href="/README.md" label="Files" icon={<IconBook />} active={isActive('/README.md')} />
          </nav>
        </div>
      ) : null}
    </header>
  )
}
