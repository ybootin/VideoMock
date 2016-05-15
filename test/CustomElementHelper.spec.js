xdescribe('CustomElementHelper', function() {

  describe('CustomElementHelper.handleStyleChange', function() {
    it('Should update width when style change', function() {
      var element = new videomock.HTMLVideoMock()

      element.style.width = '100px'

      videomock.helper.CustomElementHelper.handleStyleChange(element)

      expect(element.width).toBe(100)
    })
  })

  describe('CustomElementHelper.observeStyle', function() {
    it('Should observe change on style attribute', function() {
      var element = new videomock.HTMLVideoMock()

      expect(element.style.width).toBe('')

      videomock.helper.CustomElementHelper.observeStyle(element)

      element.style.width = '100px'
      expect(element.width).toBe(100)
    })
  })



  describe('CustomElementHelper.parseAttributes', function() {

  })

  describe('CustomElementHelper.updateAttribute', function() {

  })
})
