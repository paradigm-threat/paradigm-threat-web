import React, { useState } from 'react'
import ThemeToggle from 'hooks/client/components/ThemeToggle.jsx'
import { IconBook, IconClock, IconClose, IconHome, IconMenu, IconSearch } from 'hooks/client/components/Icons.jsx'

function NavLink(props) {
  const href = props.href
  const label = props.label
  const icon = props.icon
  const active = props.active
  const onNavigate = props.onNavigate
  const className = active ? 'pt-nav-link pt-nav-link-active' : 'pt-nav-link'
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        if (onNavigate) onNavigate(href)
      }}
    >
      {icon}
      <span>{label}</span>
    </a>
  )
}

export default function Nav(props) {
  const currentPath = props.currentPath || '/'
  const onNavigate = props.onNavigate
  const menu = useState(false)
  const isOpen = menu[0]
  const setOpen = menu[1]

  function go(href) {
    setOpen(false)
    if (onNavigate) onNavigate(href)
  }

  function isActive(href) {
    if (href === '/') {
      return currentPath === '/' || currentPath === '/index.md'
    }
    return currentPath === href
  }

  const links = [
    { href: '/', label: 'Home', icon: <IconHome /> },
    { href: '/search', label: 'Search', icon: <IconSearch /> },
    { href: '/timeline', label: 'Timeline', icon: <IconClock /> },
    { href: '/README.md', label: 'Files', icon: <IconBook /> },
  ]

  return (
    <header className="pt-site-nav" data-site-navbar="true">
      <div className="pt-nav-inner">
        <div className="pt-nav-brand-row">
          <a
            href="/"
            className="pt-brand"
            onClick={() => go('/')}
          >
            Paradigm Threat
          </a>
          <nav className="pt-nav-desktop md:pt-nav-desktop-md">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                active={isActive(link.href)}
                onNavigate={go}
              />
            ))}
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
            onClick={() => setOpen(!isOpen)}
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
            {links.map((link) => (
              <NavLink
                key={'m-' + link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                active={isActive(link.href)}
                onNavigate={go}
              />
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
