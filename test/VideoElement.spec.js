// Specifications based on this
// https://html.spec.whatwg.org/multipage/embedded-content.html#htmlvideoelement
describe('videomock.dom.VideoElement', function() {
  videomock.test.HTMLMediaElement.itShouldHaveProperties(videomock.dom.VideoElement)

  var video
  beforeEach(function() {
    video = new videomock.dom.VideoElement()
  })

  it('Should have correct attributes default values as describe in W3C', function() {
    expect(video.poster).toBe("")
    expect(video.width).toBe(videomock.constant.Common.DEFAULT_VIDEOWIDTH)
    expect(video.height).toBe(videomock.constant.Common.DEFAULT_VIDEOHEIGHT)
    expect(video.videoWidth).toBe(0)
    expect(video.videoHeight).toBe(0)
  })

  it('Should have working setters implementation', function() {
    var url = "http://poster-url"
    video.poster = url
    expect(video.poster).toBe(url)

    // check if type checking working on setter
    video.poster = 34
    expect(video.poster).toBe(url)

    video.width = 400
    expect(video.width).toBe(400)
    video.width = '300'
    expect(video.width).toBe(400)

    video.height = 400
    expect(video.height).toBe(400)
    video.height = '300'
    expect(video.height).toBe(400)

    // Should have stay unchange, because video metadata not loaded
    expect(video.videoWidth).toBe(0)
    expect(video.videoHeight).toBe(0)
  })

  it('Should implement HTMLMediaElement methods', function() {
    expect(typeof video.getVideoPlaybackQuality).toBe('function')
    expect(typeof video.webkitEnterFullscreen).toBe('function')
    expect(typeof video.webkitExitFullscreen).toBe('function')
    expect(typeof video.webkitEnterFullScreen).toBe('function')
    expect(typeof video.webkitExitFullScreen).toBe('function')
  })
})
