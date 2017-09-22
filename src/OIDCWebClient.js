'use strict'

const RelyingParty = require('@trust/oidc-rp')
const Session = require('./Session')
const storage = require('./storage')
// const fetch = require('whatwg-fetch')

// URI parameter types
const HASH = 'hash'
const QUERY = 'query'

class OIDCWebClient {
  /**
   * @constructor
   *
   * @param [options={}] {Object}
   *
   * @param options.provider {string} Provider (issuer) URL
   *
   * @param options.defaults {Object} Relying Party registration defaults
   *
   * @param options.clients {LocalJsonStore<RelyingParty>} Relying Party registration store
   * @param options.session {LocalJsonStore<Session>} Session store
   * @param options.providers {LocalJsonStore<string>} Stores provider URI by state
   *
   * @param options.store {LocalStorage} Storage to pass to RP instances
   */
  constructor (options = {}) {
    this.defaults = options.defaults || {}

    this.provider = options.provider || this.defaults.issuer || null

    this.store = options.store || storage.defaultStore()

    this.clients = options.clients || storage.defaultClientStore(this.store)
    this.session = options.session || storage.defaultSessionStore(this.store)
    this.providers = options.providers || storage.defaultProviderStore(this.store)
  }

  /**
   * @returns {Promise<Session>}
   */
  currentSession () {
    return this.session.get()  // try loading a saved session

      // If no session, attempt to parse it from authentication response
      .then(session => session || this.sessionFromResponse())

      // Failing that, return an empty session
      .then(session => session || this.emptySession())
  }

  login (provider, options = {}) {
    return Promise.resolve(provider)
      // .then(provider => provider || this.selectProviderUI())
      .then(provider => this.rpFor(provider, options))
      .then(rp => this.sendAuthRequest(rp))
  }

  logout () {
    // send a logout request to the RP
    this.clients.clear()
    this.session.clear()
  }

  /**
   * sessionFromResponse
   *
   * @returns {Promise<Session>|Promise<null>}
   */
  sessionFromResponse () {
    // determine if current url has an authentication response
    if (!this.currentUriHasAuthResponse()) {
      return Promise.resolve(null)
    }

    let responseUri = this.currentLocation()

    // init and return a session if so
    let state = this.extractState(responseUri)

    let provider = this.providers.get(state)

    return this.rpFor(provider)

      .then(rp => rp.validateResponse(responseUri, this.store))

      .then(response => Session.from(response))

      .then(session => {
        this.clearAuthResponseFromUrl()

        return this.session.save(session)  // returns session
      })
  }

  emptySession () {
    // empty session, user is not logged in, plain fetch
    return Session.from()
  }

  /**
   * Open a Select Provider popup
   * @returns {Promise}
   */
  // selectProviderUI () {
  //   return Promise.resolve(null)
  // }

  /**
   * @param provider {string} Provider (issuer) url
   * @param options {object}
   *
   * @returns {Promise<RelyingParty>}
   */
  rpFor (provider, options) {
    return this.clients.get(provider)
      .then(rp => rp || this.register(provider, options))
  }

  /**
   * Registers a public relying party client, saves the resulting
   * registration in the clients storage, and resolves with it (the rp instance)
   *
   * @param provider
   * @param options
   * @returns {Promise<RelyingParty>}
   */
  register (provider, options) {
    return this.registerPublicClient(provider, options)
      .then(rp => this.clients.save(provider, rp))
  }

  /**
   * @param provider
   * @param options
   * @returns {Promise<RelyingParty>}
   */
  registerPublicClient (provider, options = {}) {
    provider = provider || options.issuer
    let redirectUri = options['redirect_uri'] || this.currentLocation()

    let registration = {
      issuer: provider,
      grant_types: options['grant_types'] || ['implicit'],
      redirect_uris: [ redirectUri ],
      response_types: options['response_types'] || ['id_token token'],
      scope: options['scope'] || 'openid profile'
    }

    let rpOptions = {
      defaults: {
        authenticate: {
          redirect_uri: redirectUri,
          response_type: 'id_token token'
        }
      },
      store: this.store
    }

    return this.registerClient(provider, registration, rpOptions)
  }

  /**
   * @param provider
   * @param registration
   * @param rpOptions
   * @returns {Promise<RelyingParty>}
   */
  registerClient (provider, registration, rpOptions) {
    return RelyingParty.register(provider, registration, rpOptions)
  }

  /**
   * @param rp {RelyingParty}
   *
   * @return {Promise}
   */
  sendAuthRequest (rp) {
    let options = {}
    let providerUri = rp.provider.url

    return rp.createRequest(options, this.store)
      .then(authUri => {
        let state = this.extractState(authUri, QUERY)

        this.providers.save(state, providerUri)  // save provider by state

        return this.redirectTo(authUri)
      })
  }

  /**
   * Removes authentication response data (access token, id token etc) from
   * the current url's hash fragment.
   */
  clearAuthResponseFromUrl () {
    // TODO: Implement
    let clearedUrl = this.currentLocation()

    this.replaceCurrentUrl(clearedUrl)
  }

  /**
   * Extracts and returns the `state` query or hash fragment param from a uri
   *
   * @param uri {string}
   * @param uriType {string} 'hash' or 'query'
   *
   * @return {string|null} Value of the `state` query or hash fragment param
   */
  extractState (uri, uriType = HASH) {
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
   * Returns the current window's URI
   *
   * @return {string|null}
   */
  currentLocation () {
    if (typeof window === 'undefined') { return null }

    if (!window || !window.location) { return null }

    return window.location.href
  }

  /**
   * Replaces the current document's URL (used to clear the credentials in
   * the hash fragment after a redirect from the provider).
   *
   * @param newUrl {string|null}
   */
  replaceCurrentUrl (newUrl) {
    if (typeof window === 'undefined') { return null }

    let history = window.history

    if (!history) { return null }

    history.replaceState(history.state, history.title, newUrl)
  }

  /**
   * Tests whether the current URI is the result of an AuthenticationRequest
   * return redirect.
   *
   * @return {boolean}
   */
  currentUriHasAuthResponse () {
    let currentUri = this.currentLocation()
    let stateParam = this.extractState(currentUri, HASH)

    return !!stateParam
  }

  /**
   * Redirects the current window to the given uri.
   *
   * Note: the `return false` is due to odd Chrome requirement/quirk
   *
   * @param uri {string}
   */
  redirectTo (uri) {
    if (typeof window === 'undefined') { return null }

    window.location.href = uri

    return false
  }
}

module.exports = OIDCWebClient
