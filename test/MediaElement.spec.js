// Specifications based on this
// https://html.spec.whatwg.org/multipage/embedded-content.html#htmlmediaelement
describe('videomock.dom.MediaElement', function() {
  var media
  beforeEach(function() {
    media = new videomock.dom.MediaElement()
  })

  it('Should have correct attributes default values as describe in W3C', function() {

    expect(media.autoplay).toBe(false)
    expect(media.preload).toBe(videomock.constant.Preload.DEFAULT)
    expect(media.controls).toBe(false)
    expect(media.src).toBe("")
    expect(media.currentSrc).toBe("")
    expect(isNaN(media.duration)).toBe(true)
    expect(media.currentTime).toBe(0)
    expect(media.loop).toBe(false)
    expect(media.muted).toBe(false)
    expect(media.defaultMuted).toBe(false)
    expect(media.paused).toBe(false)
    expect(media.seeking).toBe(false)
    expect(media.ended).toBe(false)
    expect(media.error).toBe(null)
    expect(media.playbackRate).toBe(1)
    expect(media.defaultPlaybackRate).toBe(1)
    expect(media.networkState).toBe(videomock.constant.MediaElement.NETWORK_EMPTY)
    expect(media.readyState).toBe(videomock.constant.MediaElement.HAVE_NOTHING)
    expect(media.volume).toBe(videomock.constant.Common.DEFAULT_VOLUME)

    expect(media.buffered.length).toBe(0)
    expect(media.played.length).toBe(0)
    expect(media.seekable.length).toBe(0)

  })

  it('Should have working setters for non-readonly attributes', function() {
    media.autoplay = true
    expect(media.autoplay).toBe(true)


  })

  it('Should have a working getter/setter for preload', function() {
    media.preload = videomock.constant.Preload.METADATA
    expect(media.preload).toBe(videomock.constant.Preload.METADATA)
    media.preload = videomock.constant.Preload.AUTO
    expect(media.preload).toBe(videomock.constant.Preload.AUTO)
    media.preload = videomock.constant.Preload.NONE
    expect(media.preload).toBe(videomock.constant.Preload.NONE)
    media.preload = videomock.constant.Preload.EMPTY
    expect(media.preload).toBe(videomock.constant.Preload.EMPTY)

    // state should not change from the previous state
    media.preload = 'fakevalue'
    expect(media.preload).toBe(videomock.constant.Preload.EMPTY)
  })

  it('Should implement HTMLMediaElement methods', function() {

  })


})
