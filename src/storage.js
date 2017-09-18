'use strict'

const RelyingParty = require('@trust/oidc-rp')
const LocalJsonStore = require('./LocalJsonStore')
const Session = require('./Session')

module.exports = {
  defaultStore,
  defaultClientStore,
  defaultSessionStore
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
