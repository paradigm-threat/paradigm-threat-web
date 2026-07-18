/**
 * Opt-in Relay IPFS image with seed-status UI.
 *
 * Plain `<img src={url}>` still fails normally when the CID is not on the gateway.
 * Use this component when the site wants retry + progress messaging.
 *
 * CleverScript notes: arrow onClick only; sync fetch during render.
 * Retries via browser setTimeout when `isClientLive()` (not during SSR).
 */
import React, { useState } from 'react'
import { isClientLive } from '@clevertree/style-internal'

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

function statusUrl(src) {
  let u = str(src).trim()
  if (u.length === 0) return ''
  const join = u.indexOf('?') >= 0 ? '&' : '?'
  return u + join + 'relayAssetStatus=1'
}

function parseStatus(resp) {
  const empty = {
    ok: false,
    retryable: false,
    error: 'unknown',
    message: '',
    progressPct: null,
    seedState: 'unknown',
    providers: null,
    retryAfterSecs: 5,
    cid: '',
    hint: '',
  }
  if (!resp) return empty
  if (resp.ok === true && resp.status === 200) {
    let seedState = 'cached'
    let progressPct = 100
    try {
      const text = resp.text ? resp.text : ''
      if (text.length > 0 && text.charAt(0) === '{') {
        const data = JSON.parse(text)
        if (data && data.seed) {
          if (typeof data.seed.state === 'string') seedState = data.seed.state
          if (typeof data.seed.progressPct === 'number') progressPct = data.seed.progressPct
        }
        if (seedState !== 'cached' && data.error && data.error !== 'ok') {
          /* fall through to error parse below by reusing text */
        } else {
          return {
            ok: true,
            retryable: false,
            error: 'ok',
            message: 'ready',
            progressPct: 100,
            seedState: 'cached',
            providers: null,
            retryAfterSecs: 0,
            cid: '',
            hint: '',
          }
        }
      } else {
        return {
          ok: true,
          retryable: false,
          error: 'ok',
          message: 'ready',
          progressPct: 100,
          seedState: 'cached',
          providers: null,
          retryAfterSecs: 0,
          cid: '',
          hint: '',
        }
      }
    } catch (e) {
      return {
        ok: true,
        retryable: false,
        error: 'ok',
        message: 'ready',
        progressPct: 100,
        seedState: 'cached',
        providers: null,
        retryAfterSecs: 0,
        cid: '',
        hint: '',
      }
    }
  }
  let text = resp.text ? resp.text : ''
  if (text.length === 0) {
    return {
      ok: false,
      retryable: resp.status === 425 || resp.status === 503 || resp.status === 504 || resp.status === 502,
      error: 'http-' + resp.status,
      message: 'HTTP ' + resp.status,
      progressPct: null,
      seedState: 'unknown',
      providers: null,
      retryAfterSecs: 5,
      cid: '',
      hint: '',
    }
  }
  try {
    const data = JSON.parse(text)
    const seed = data && data.seed ? data.seed : {}
    return {
      ok: data.error === 'ok',
      retryable: data.retryable === true,
      error: typeof data.error === 'string' ? data.error : 'unknown',
      message: typeof data.message === 'string' ? data.message : '',
      progressPct: typeof seed.progressPct === 'number' ? seed.progressPct : null,
      seedState: typeof seed.state === 'string' ? seed.state : 'unknown',
      providers: typeof seed.providers === 'number' ? seed.providers : null,
      retryAfterSecs: typeof data.retryAfterSecs === 'number' ? data.retryAfterSecs : 5,
      cid: typeof data.cid === 'string' ? data.cid : '',
      hint: seed.hint && typeof seed.hint === 'string' ? seed.hint : '',
    }
  } catch (e) {
    return empty
  }
}

function statusLabel(st) {
  if (st.ok) return 'Ready'
  if (st.seedState === 'fetching') {
    if (st.progressPct !== null) return 'Downloading… ' + st.progressPct + '%'
    return 'Downloading from IPFS…'
  }
  if (st.seedState === 'unavailable') return 'Not available on the network'
  if (st.seedState === 'missing') {
    if (st.providers !== null) return 'Waiting for peers (' + st.providers + ' providers)'
    return 'Waiting for this node to fetch the CID…'
  }
  if (st.error === 'ipfs-pending') return 'Seeding…'
  if (st.error === 'ipfs-busy') return 'Busy — retrying…'
  if (st.error === 'ipfs-gateway-timeout') return 'Gateway timeout — retrying…'
  if (st.message) return st.message
  return 'Loading…'
}

/**
 * @param props.src — asset URL (repo path or absolute)
 * @param props.alt
 * @param props.className — applied to the final <img>
 * @param props.maxAttempts — default 24
 * @param props.minRetryMs — default 2000
 * @param props.maxRetryMs — default 15000
 */
export default function RelayImage(props) {
  let src = ''
  let alt = ''
  let className = ''
  let maxAttempts = 24
  let minRetryMs = 2000
  let maxRetryMs = 15000
  try {
    src = str(props.src)
  } catch (e) {
    src = ''
  }
  try {
    alt = str(props.alt)
  } catch (e) {
    alt = ''
  }
  try {
    className = str(props.className)
  } catch (e) {
    className = ''
  }
  try {
    if (typeof props.maxAttempts === 'number') maxAttempts = props.maxAttempts
  } catch (e) {
    maxAttempts = 24
  }
  try {
    if (typeof props.minRetryMs === 'number') minRetryMs = props.minRetryMs
  } catch (e) {
    minRetryMs = 2000
  }
  try {
    if (typeof props.maxRetryMs === 'number') maxRetryMs = props.maxRetryMs
  } catch (e) {
    maxRetryMs = 15000
  }

  const attemptState = useState(0)
  const attempt = attemptState[0]
  const setAttempt = attemptState[1]
  const schedState = useState(-1)
  const scheduledFor = schedState[0]
  const setScheduledFor = schedState[1]
  const live = isClientLive() === true

  if (src.length === 0) {
    return (
      <div className="relay-image relay-image-empty" data-relay-image="empty">
        <span className="relay-image-msg">Missing image src</span>
      </div>
    )
  }

  const probe = statusUrl(src)
  const resp = fetch(probe, { method: 'GET' })
  const st = parseStatus(resp)

  if (st.ok) {
    return <img src={src} alt={alt} className={className} data-relay-image="ready" />
  }

  const exhausted = attempt >= maxAttempts
  const permanent = st.retryable !== true
  if (exhausted || permanent) {
    return (
      <div className="relay-image relay-image-failed" data-relay-image="failed" data-error={st.error}>
        <span className="relay-image-msg">{statusLabel(st)}</span>
        {st.hint ? <span className="relay-image-hint">{st.hint}</span> : null}
        {st.cid ? <span className="relay-image-cid">{st.cid}</span> : null}
        <button
          type="button"
          className="relay-image-retry"
          onClick={() => {
            setScheduledFor(-1)
            setAttempt(0)
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (live && st.retryable === true && scheduledFor !== attempt) {
    let delay = st.retryAfterSecs > 0 ? st.retryAfterSecs * 1000 : minRetryMs
    if (delay < minRetryMs) delay = minRetryMs
    if (delay > maxRetryMs) delay = maxRetryMs
    setScheduledFor(attempt)
    try {
      if (typeof setTimeout === 'function') {
        setTimeout(() => {
          setAttempt(attempt + 1)
        }, delay)
      }
    } catch (e) {
      /* host without timers */
    }
  }

  const pct = st.progressPct
  return (
    <div
      className="relay-image relay-image-pending"
      data-relay-image="pending"
      data-seed-state={st.seedState}
      data-attempt={'' + attempt}
    >
      <span className="relay-image-msg">{statusLabel(st)}</span>
      {pct !== null ? (
        <div className="relay-image-bar">
          <div className="relay-image-bar-fill" style={{ width: pct + '%' }} />
        </div>
      ) : null}
      {st.hint ? <span className="relay-image-hint">{st.hint}</span> : null}
    </div>
  )
}
