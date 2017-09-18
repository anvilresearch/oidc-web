'use strict'

const { LocalJsonStore } = require('../src/index')

const chai = require('chai')
chai.use(require('sinon-chai'))
chai.use(require('dirty-chai'))
chai.should()

const expect = chai.expect

describe('LocalJsonStore', () => {
  it('should exist', () => {
    expect(LocalJsonStore).to.exist()
  })
})
