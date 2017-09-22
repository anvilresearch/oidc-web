'use strict'

// URI parameter types
const HASH = 'hash'
const QUERY = 'query'

module.exports = {
  clearAuthResponseFromUrl,
  currentLocation,
  currentUriHasAuthResponse,
  stateFromUri,
  redirectTo,
  replaceCurrentUrl,
  HASH,
  QUERY
}

/**
 * Removes authentication response data (access token, id token etc) from
 * the current url's hash fragment.
 */
function clearAuthResponseFromUrl () {
  // TODO: Implement
  let clearedUrl = currentLocation()

  replaceCurrentUrl(clearedUrl)
}

/**
 * Returns the current window's URI
 *
 * @return {string|null}
 */
function currentLocation () {
  if (typeof window === 'undefined') { return null }

  if (!window || !window.location) { return null }

  return window.location.href
}

/**
 * Tests whether the current URI is the result of an AuthenticationRequest
 * return redirect.
 *
 * @return {boolean}
 */
function currentUriHasAuthResponse () {
  let currentUri = currentLocation()
  let stateParam = stateFromUri(currentUri, HASH)

  return !!stateParam
}

/**
 * Extracts and returns the `state` query or hash fragment param from a uri
 *
 * @param uri {string}
 * @param uriType {string} 'hash' or 'query'
 *
 * @return {string|null} Value of the `state` query or hash fragment param
 */
function stateFromUri (uri, uriType = HASH) {
  if (!uri) { return null }

  let uriObj = new URL(uri)
  let state

  if (uriType === HASH) {
    let hash = uriObj.hash || '#'
    let params = new URLSearchParams(hash.substr(1))
    state = params.get('state')
  }

  if (uriType === QUERY) {
    state = uriObj.searchParams.get('state')
  }

  return state
}

/**
 * Replaces the current document's URL (used to clear the credentials in
 * the hash fragment after a redirect from the provider).
 *
 * @param newUrl {string|null}
 */
function replaceCurrentUrl (newUrl) {
  if (typeof window === 'undefined') { return null }

  let history = window.history

  if (!history) { return null }

  history.replaceState(history.state, history.title, newUrl)
}

/**
 * Redirects the current window to the given uri.
 *
 * Note: the `return false` is due to odd Chrome requirement/quirk
 *
 * @param uri {string}
 */
function redirectTo (uri) {
  if (typeof window === 'undefined') { return null }

  window.location.href = uri

  return false
}
