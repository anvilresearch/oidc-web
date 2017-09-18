'use strict'

class Session {
  static from (data) {
    return new Session(data)
  }
}

module.exports = Session
