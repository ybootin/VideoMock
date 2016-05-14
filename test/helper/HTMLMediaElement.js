/**
 * HTMLMediaElement test
 */
var videomock;
(function (videomock) {
    var test;
    (function (test) {
        var HTMLMediaElement = (function () {
            function HTMLMediaElement() {
            }

            HTMLMediaElement.itShouldHaveProperties = function(Media) {

              describe('HTMLMediaElement properties', function() {
                var media
                beforeEach(function() {
                  media = Media === 'video' ? document.createElement('video') : new Media()
                })

                it('Should have property autoplay', function() {
                  // default value
                  expect(media.autoplay).toBe(false)

                  media.autoplay = true
                  expect(media.autoplay).toBe(true)
                })

                it('Should have property preload', function() {
                  // default value
                  expect(videomock.constant.Preload.VALUES.indexOf(media.preload) > -1).toBe(true)

                  media.preload = videomock.constant.Preload.METADATA
                  expect(media.preload).toBe(videomock.constant.Preload.METADATA)
                  media.preload = videomock.constant.Preload.AUTO
                  expect(media.preload).toBe(videomock.constant.Preload.AUTO)
                  media.preload = videomock.constant.Preload.NONE
                  expect(media.preload).toBe(videomock.constant.Preload.NONE)

                  // Behavior change between browsers
                  // Chrome set preload="auto" when set ""
                  // Firefox set preload="" when set ""
                  media.preload = videomock.constant.Preload.EMPTY
                  expect(videomock.constant.Preload.VALUES.indexOf(media.preload) > -1).toBe(true)

                  // Check wrong preload value settings
                  media.preload = 'fakevalue'
                  expect(videomock.constant.Preload.VALUES.indexOf(media.preload) > -1).toBe(true)
                })

                it('Should have property controls', function() {
                  // default value
                  expect(media.controls).toBe(false)

                  media.controls = true
                  expect(media.controls).toBe(true)
                })

                it('Should have property src', function() {
                  // default value
                  expect(media.src).toBe('')

                  var src = 'http://src/video.mp4'
                  media.src = src
                  expect(media.src).toBe(src)
                })

                it('Should have property currentSrc', function() {
                  // default value
                  expect(media.currentSrc).toBe('')

                  // readonly
                  var src = 'http://src/video.mp4'
                  media.currentSrc = src
                  expect(media.currentSrc).toBe('')
                })

                it('Should have property duration', function() {
                  // default value
                  expect(isNaN(media.duration)).toBe(true)

                  media.duration = 10
                  expect(isNaN(media.duration)).toBe(true)
                })

                it('Should have property currentTime', function() {
                  // default value
                  expect(media.currentTime).toBe(0)

                  // FIXME : not sure this test is revelant
                  media.currentTime = 10
                  expect(media.currentTime).toBe(10)
                })

                it('Should have property loop', function() {
                  // default value
                  expect(media.loop).toBe(false)

                  media.loop = true
                  expect(media.loop).toBe(true)
                })

                it('Should have property muted', function() {
                  // default value
                  expect(media.muted).toBe(false)

                  media.muted = true
                  expect(media.muted).toBe(true)
                })

                it('Should have property defaultMuted', function() {
                  // default value
                  expect(media.defaultMuted).toBe(false)

                  media.defaultMuted = true
                  expect(media.defaultMuted).toBe(true)
                })

                it('Should have property paused', function() {
                  // default value
                  expect(media.paused).toBe(true)

                  media.paused = false
                  expect(media.paused).toBe(true)
                })

                it('Should have property seeking', function() {
                  // default value
                  expect(media.seeking).toBe(false)

                  media.seeking = true
                  expect(media.seeking).toBe(false)
                })

                it('Should have property ended', function() {
                  // default value
                  expect(media.ended).toBe(false)

                  media.ended = true
                  expect(media.ended).toBe(false)
                })

                it('Should have property error', function() {
                  // default value
                  expect(media.error).toBe(null)

                  // fixme should test to write MediaError object
                  media.error = {}
                  expect(media.error).toBe(null)
                })

                it('Should have property playbackRate', function() {
                  // default value
                  expect(media.playbackRate).toBe(1)

                  media.playbackRate = 2
                  expect(media.playbackRate).toBe(2)
                })

                it('Should have property defaultPlaybackRate', function() {
                  // default value
                  expect(media.defaultPlaybackRate).toBe(1)

                  media.defaultPlaybackRate = 2
                  expect(media.defaultPlaybackRate).toBe(2)
                })

                it('Should have property networkState', function() {
                  // default value
                  expect(media.networkState).toBe(videomock.constant.MediaElement.NETWORK_EMPTY)

                  media.networkState = 2
                  expect(media.networkState).toBe(videomock.constant.MediaElement.NETWORK_EMPTY)
                })

                it('Should have property readyState', function() {
                  // default value
                  expect(media.readyState).toBe(videomock.constant.MediaElement.HAVE_NOTHING)

                  media.readyState = 2
                  expect(media.readyState).toBe(videomock.constant.MediaElement.HAVE_NOTHING)
                })

                it('Should have property volume', function() {
                  // default value
                  expect(media.volume).toBe(videomock.constant.Common.DEFAULT_VOLUME)

                  try {
                    media.volume = 2
                  } catch (e) {}

                  expect(media.volume).toBe(videomock.constant.Common.DEFAULT_VOLUME)

                  media.volume = 0.5
                  expect(media.volume).toBe(0.5)
                })

                it('Should have property buffered', function() {
                  // default value
                  expect(media.buffered.length).toBe(0)

                  media.buffered = []
                  expect(media.buffered.length).toBe(0)
                })

                it('Should have property played', function() {
                  // default value
                  expect(media.played.length).toBe(0)

                  media.played = []
                  expect(media.played.length).toBe(0)
                })

                it('Should have property seekable', function() {
                  // default value
                  expect(media.played.length).toBe(0)

                  media.played = []
                  expect(media.played.length).toBe(0)
                })
              })
            }
            HTMLMediaElement.itShouldHaveMethods = function(Media) {

            }

            HTMLMediaElement.itShouldWork = function(Media) {

            }
            return HTMLMediaElement;
        })();
        test.HTMLMediaElement = HTMLMediaElement;
    })(test = videomock.test || (videomock.test = {}));
})(videomock || (videomock = {}));
