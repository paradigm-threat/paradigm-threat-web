/**
 * CleverScript-safe JSON helpers — never touch a bare `JSON` identifier
 * (SSR can throw "Undefined: JSON" before typeof can help).
 */

function escapeJsonString(s) {
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    if (c === '\\') out = out + '\\\\'
    else if (c === '"') out = out + '\\"'
    else if (c === '\n') out = out + '\\n'
    else if (c === '\r') out = out + '\\r'
    else if (c === '\t') out = out + '\\t'
    else out = out + c
  }
  return out
}

/** Hand-built QUERY body — no stringify. */
export function queryIndexBody(query, limit, order) {
  let body =
    '{"collection":"index","query":"' +
    escapeJsonString(query) +
    '","limit":' +
    limit
  if (order && order.length > 0) {
    body = body + ',"order":"' + escapeJsonString(order) + '"'
  }
  return body + '}'
}

export function parseJson(text) {
  try {
    const g = globalThis
    if (g && g.JSON && typeof g.JSON.parse === 'function') {
      return g.JSON.parse(text)
    }
  } catch (e) {
    return null
  }
  return null
}
