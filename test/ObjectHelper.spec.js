describe('videomock.helper.ObjectHelper', function() {
  var prop = videomock.helper.ObjectHelper.createObjectProperty
  var properties = {
    'string': prop(true, 'value', 'string'),
    'boolean': prop(true, true, 'boolean'),
    'number': prop(true, 1, 'number'),
    'function': prop(true, function() {}, 'function'),
    'readonly': prop(false, 'readonly', 'string'),
  }

  it('Should exist', function() {
    expect(typeof videomock.helper.ObjectHelper).toBe('function')
  })

  it('Should have statics methods', function() {
    expect(typeof videomock.helper.ObjectHelper.genGettersSetters).toBe('function')
    expect(typeof videomock.helper.ObjectHelper.genGetterSetter).toBe('function')
    expect(typeof videomock.helper.ObjectHelper.initPropertiesValues).toBe('function')
    expect(typeof videomock.helper.ObjectHelper.createObjectProperty).toBe('function')
    expect(typeof videomock.helper.ObjectHelper.toNumber).toBe('function')
  })

  it('Should have toNumber helper working', function() {
    expect(videomock.helper.ObjectHelper.toNumber('300')).toBe(300)
    expect(videomock.helper.ObjectHelper.toNumber('A1')).toBe('A1')
  })

  describe('videomock.helper.ObjectHelper.genGetterSetter', function() {
    var object

    beforeEach(function() {
      Proto = function() {}
      object = new Proto()
    })

    it('Should implement property on an Object', function() {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.boolean)

      // default value and read test
      expect(object.test).toBe(properties.boolean.defaultValue)

      // write test
      object.test = false
      expect(object.test).toBe(false)
      object.test = 'qsdqsdqsd'
      expect(object.test).toBe(true)
    })

    it('Should have getter _get_[property]', function() {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.boolean)
      expect(typeof Proto.prototype._get_test).toBe('function')
      expect(Proto.prototype._get_test.call(object)).toBe(properties.boolean.defaultValue)
    })

    it('Should have setter _set_[property]', function() {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.boolean)
      expect(typeof Proto.prototype._set_test).toBe('function')
      Proto.prototype._set_test.call(object, false)
      expect(object.test).toBe(false)
    })

    it('Should implement a readonly property', function() {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.readonly)
      expect(object.test).toBe(properties.readonly.defaultValue)

      object.test = 'test'
      expect(object.test).toBe(properties.readonly.defaultValue)
    })

    it('Should implement property typed as string', function() {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.string)

      expect(object.test).toBe(properties.string.defaultValue)
      object.test = 'test1'
      expect(object.test).toBe('test1')

      object.test = 1
      expect(object.test).toBe('1')

      object.test = {'a': 1}
      expect(typeof object.test).toBe('string')

      object.test = true
      expect(typeof object.test).toBe('string')
    })

    it('Should implement property typed as number', function() {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.number)

      expect(object.test).toBe(properties.number.defaultValue)
      object.test = 2
      expect(object.test).toBe(2)

      object.test = '1'
      expect(object.test).toBe(1)

      object.test = NaN
      expect(object.test).toBe(properties.number.defaultValue)

      object.test = -1
      expect(object.test).toBe(properties.number.defaultValue)
    })

    it('Should implement property typed as boolean', function() {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.boolean)

      expect(object.test).toBe(properties.boolean.defaultValue)
      object.test = false
      expect(object.test).toBe(false)

      object.test = 1
      expect(object.test).toBe(true)

      object.test = 'false'
      expect(object.test).toBe(true)
    })

    it('Should implement property typed as function', function(done) {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.function)

      expect(object.test).toBe(properties.function.defaultValue)

      object.test = false
      expect(object.test).toBe(properties.function.defaultValue)

      object.test = function() {
        done()
      }

      object.test()
    })
  })

  describe('videomock.helper.ObjectHelper.genGettersSetters', function() {
    var Proto = function() {}
    var object = new Proto()

    videomock.helper.ObjectHelper.genGettersSetters(Proto, properties)

    it('Should have correct getters/setters', function() {
      expect(object.string).toBe(properties.string.defaultValue)
      expect(object.boolean).toBe(properties.boolean.defaultValue)
      expect(object.number).toBe(properties.number.defaultValue)
      expect(typeof object.function).toBe('function')
      expect(object.readonly).toBe(properties.readonly.defaultValue)
    })
  })

})
