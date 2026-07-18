import React from 'react'

function Icon(props) {
  const size = props.size
  const children = props.children
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      style={{ display: 'inline-block', flexShrink: 0, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
      {children}
    </svg>
  )
}

export function IconBook() {
  return (
    <Icon size={18}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Icon>
  )
}
