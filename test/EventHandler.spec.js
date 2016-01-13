// Test EventHandler

describe('EventHandler', function() {
  var testEventName = 'testevent'
  var handler

  beforeEach(function() {
    handler = new videomock.event.EventHandler()
  })

  it('Should expose methods addEventListener, removeEventListener, handleEvent, clearListeners', function() {
    expect(typeof handler.addEventListener === 'function').toBe(true)
    expect(typeof handler.removeEventListener === 'function').toBe(true)
    expect(typeof handler.handleEvent === 'function').toBe(true)
    expect(typeof handler.clearListeners === 'function').toBe(true)
  })

  it('Should add an event listener and trigger callback', function(done) {
    var callback = function(evt) {
      if (!evt.type) {
        fail('callback doesn\'t return a valid event')
      }

      if (evt.type !== testEventName) {
        fail('evt.type should be ' + testEventName + ' , but is ' + testEventName)
      }

      done()
    }

    handler.addEventListener(testEventName, callback)

    handler.handleEvent(new CustomEvent(testEventName))
  })

  it('Should remove an event listener', function(done) {
    var callback = function(evt) {
      fail('callback is removed, it should not have been called')
    }

    handler.addEventListener(testEventName, callback)
    handler.removeEventListener(testEventName, callback)

    handler.handleEvent(new CustomEvent(testEventName))

    done()
  })

  it('Should clear all listener', function(done) {
    handler.addEventListener('a', function() {fail('callback 1 called')})
    handler.addEventListener('b', function() {fail('callback 2 called')})
    handler.clearListeners()
    handler.handleEvent('a')
    handler.handleEvent('b')
    done()
  })
})
