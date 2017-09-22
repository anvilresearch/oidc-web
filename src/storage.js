'use strict'

const RelyingParty = require('@trust/oidc-rp')
const LocalJsonStore = require('./LocalJsonStore')
const Session = require('@trust/oidc-rp/lib/Session')

module.exports = {
  defaultClientStore,
  defaultProviderStore,
  defaultSessionStore,
  defaultStore
}

function defaultStore () {
  return global.localStorage
}

function defaultClientStore (store) {
  return new LocalJsonStore({
    className: RelyingParty,
    namespace: 'oidc.clients',
    store: store || defaultStore()
  })
}

function defaultSessionStore (store) {
  return new LocalJsonStore({
    className: Session,
    namespace: 'oidc.session',
    store: store || defaultStore()
  })
}

/**
 * Store Provider URIs by state param
 *
 * @param store
 *
 * @returns {LocalJsonStore}
 */
function defaultProviderStore (store) {
  return new LocalJsonStore({
    className: Session,
    namespace: 'oidc.providers',
    store: store || defaultStore()
  })
}
