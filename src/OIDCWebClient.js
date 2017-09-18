'use strict'

const RelyingParty = require('@trust/oidc-rp')

class OIDCWebClient {
  /**
   * @constructor
   *
   * @param provider {string} Provider (issuer) URL
   * @param clients {LocalJsonStore<RP>} Relying Party registration store
   * @param session {LocalJsonStore<Session>} Session store
   * @param defaults {Object} Relying Party registration defaults
   * @param store {LocalStorage} Storage to pass to RP instances
   */
  constructor ({ provider, clients, session, defaults, store }) {
    defaults = defaults || {}
    this.defaults = defaults
    this.clients = clients
    this.session = session
    this.provider = provider || defaults.issuer
    this.store = store || global.localStorage
  }

  currentSession () {
  }

  login (provider, options = {}) {
  }

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
   * Returns the current window's URI
   *
   * @return {string|null}
   */
  currentLocation () {
    if (typeof window === 'undefined') { return null }

    if (!window || !window.location) { return null }

    return window.location.href
  }
}

module.exports = OIDCWebClient
