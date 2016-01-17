describe('videomock.helper.ObjectHelper', function() {
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

  describe('videomock.helper.ObjectHelper.genGetterSetter', function() {
    var object
    var prop = videomock.helper.ObjectHelper.createObjectProperty
    var properties = {
      'string': prop(true, 'value', 'string'),
      'boolean': prop(true, true, 'boolean'),
      'number': prop(true, 1, 'number'),
      'function': prop(true, function() {}, 'function'),
      'readonly': prop(false, 'readonly', 'string'),
    }
    beforeEach(function() {
      Proto = function() {}
      object = new Proto()
    })
    it('Should implement propertie on an Object', function() {
      videomock.helper.ObjectHelper.genGetterSetter(Proto, 'test', properties.boolean)

      expect(object.test).toBe(true)
    })
  })

})
