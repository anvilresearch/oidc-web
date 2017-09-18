'use strict'

const OIDCWebClient = require('../src/index')

const chai = require('chai')
// const sinon = require('sinon')
chai.use(require('sinon-chai'))
// chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
chai.should()

const expect = chai.expect

describe('OIDCWebClient', () => {
  it('should exist', () => {
    expect(OIDCWebClient).to.exist()
  })
})
