'use strict'

class LocalJsonStore {
  constructor (namespace, options) {
    this.namespace = namespace
    this.className = options.className
    this.store = options.store || global.localStorage
  }

  get (key) {
    let contents = this.store.getItem(this.namespace + key)

    try {
      contents = JSON.parse(contents)
    } catch (err) {
      return Promise.resolve(null)
    }

    if (this.className) {
      return this.className.from(contents)  // async, resolve with instance
    } else {
      return Promise.resolve(contents)      // resolve with the raw JSON
    }
  }

  save (key, value) {
    let contents = JSON.stringify(value)

    this.store.setItem(this.namespace + key, contents)

    return Promise.resolve(value)  // async only to match get()
  }

  clear () {
    // TODO: Clear only items starting with this.namespace
    this.store.clear()
  }
}

module.exports = LocalJsonStore
