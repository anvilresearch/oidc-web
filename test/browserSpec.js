'use strict'

global.URL = require('whatwg-url').URL
global.URLSearchParams = require('whatwg-url').URLSearchParams

const browser = require('../src/browser')

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.should()

const expect = chai.expect

const currentLocation = 'https://app.com/'

global.window = {
  location: { href: currentLocation }
}

describe('browser', () => {
  describe('currentLocationNoAuth', () => {
    after(() => {
      global.window.location.href = currentLocation
    })

    it('should return the current url unchanged if no hash fragment', () => {

    })

    it('should preserve the current url with a hash fragment', () => {
      let currentLocation = 'https://app.com/#test'
      global.window.location.href = currentLocation

      expect(browser.currentLocationNoAuth()).to.equal(currentLocation)
    })

    it('should filter out auth-related hash fragments', () => {
      let currentLocation = 'https://app.com/#test' +
        '&id_token=idt0ken&access_token=acce$$&state=state123' +
        '&token_type=bearer&expires_in=1234'

      global.window.location.href = currentLocation

      expect(browser.currentLocationNoAuth()).to.equal('https://app.com/#test')
    })

    it('should clear the hash fragments if only auth-related ones present', () => {
      let currentLocation = 'https://app.com/#' +
        '&id_token=idt0ken&access_token=acce$$&state=state123' +
        '&token_type=bearer&expires_in=1234'

      global.window.location.href = currentLocation

      expect(browser.currentLocationNoAuth()).to.equal('https://app.com/')
    })
  })
})
