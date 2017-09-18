'use strict'

class LocalJsonStore {
  constructor (namespace, options = {}) {
    this.namespace = namespace
    this.className = options.className
    this.store = options.store || global.localStorage
  }

  get (key) {
    key = key ? `${this.namespace}.${key}` : this.namespace

    let contents = this.store.getItem(key)

    try {
      contents = JSON.parse(contents)
    } catch (err) {
      return Promise.resolve(null)
    }

    return Promise.resolve()
      .then(() => {
        if (!this.className) {
          return contents  // resolve with raw JSON
        }

        return this.className.from(contents)  // resolve with instance
      })
  }

  save (key, value) {
    key = key ? `${this.namespace}.${key}` : this.namespace

    let contents = JSON.stringify(value)

    this.store.setItem(key, contents)

    return Promise.resolve(value)  // async only to match get()
  }

  clear () {
    // TODO: Clear only items starting with this.namespace
    this.store.clear()
  }
}

module.exports = LocalJsonStore
