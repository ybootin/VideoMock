/**
 * HTMLVideoElement test
 */
var videomock;
(function(videomock) {
  var test;
  (function(test) {
    var HTMLVideoElement = (function() {
      function HTMLVideoElement() {
      }

      // Add a construct helper for native HTMLVideoElement testing
      HTMLVideoElement.construct = function(Video) {
        if (Video === 'video') {
          return document.createElement('video')
        } else {
          return new Video()
        }
      }

      // Return a valid src, work both for native video or videomock
      HTMLVideoElement.getSrc = function(Video, options) {
        if (Video === 'video') {
          return 'http://techslides.com/demos/sample-videos/small.mp4'
        } else {
          return videomock.VideoMockURL.gen(options)
        }
      }

      HTMLVideoElement.itShouldWorkInDOM = function(Video) {
        var video = HTMLVideoElement.construct(Video)

        it('Should append to DOM as an HTMLDivElement', function() {
          window.document.body.appendChild(video)
        })
      }

      HTMLVideoElement.itShouldWork = function(Video) {
        videomock.test.HTMLMediaElement.itShouldHaveProperties(videomock.HTMLVideoMock)

        var video;
        var src;

        beforeEach(function() {
          video = HTMLVideoElement.construct(Video)
          src = HTMLVideoElement.getSrc(Video, {
            'duration': 2
          })
          video.src = src
        });

        it('Should start playback', function(done) {
          video.addEventListener('play', function() {
            done()
          })

          video.play()
        })

        it('Should not start loading if preload=none and load() not called', function(done) {
          video = HTMLVideoElement.construct(Video)
          video.preload = "none"

          var loaded = false
          var onload = function() {
            loaded = true
          }
          video.addEventListener('loadeddata', onload)
          video.addEventListener('progress', onload)
          video.addEventListener('loadedmetadata', onload)

          setTimeout(function() {
            if (!loaded) {
              done()
            } else {
              fail('Video have load')
            }
          }, 1000)

          video.src = HTMLVideoElement.getSrc(Video, {
            'duration': 2
          })
        })

        it('Should handle autoplay attribute', function(done) {
          video.addEventListener('play', function() {
            done()
          })

          video.autoplay = true
        })

        it('Should have metadata', function(done) {
          video.addEventListener('loadedmetadata', function() {
            done()
          })

          video.load()
        })

        it('Should have first frame loaded', function(done) {
          video = HTMLVideoElement.construct(Video)

          video.addEventListener('loadeddata', function() {
            done()
          })
          video.src = src
          // force load, if default preload propertie is not `auto`
          //video.load()
        })

        // FIXME, this check is no more revelant as default behavior is preload auto
        xit('Should handle preload attribute', function(done) {
          video.addEventListener('loadeddata', function() {
            done()
          })

          video.preload = 'auto'
        })

        it('Should handle preload metadata only', function(done) {
          video = HTMLVideoElement.construct(Video)

          var metadata = false
          var loadeddata = false
          video.addEventListener('loadeddata', function() {
            loadeddata = true
          })
          video.addEventListener('loadedmetadata', function() {
            metadata = true
          })
          setTimeout(function() {
            if (!loadeddata && metadata) {
              done()
            } else {
              fail('loadedmetadata event should be dispatched, but not loadeddata event (loadeddata:' + loadeddata.toString() + ', loadedmetadata:' + metadata.toString() + ')')
            }
          }, 1000)

          video.preload = 'metadata'

          video.src = src
        })

        it('Should load progress', function(done) {
          video.addEventListener('progress', function() {
            done()
          })

          video.load()
        })

        it('Should timeupdate', function(done) {
          video.addEventListener('timeupdate', function() {
            done()
          })
          video.play()
        })

        it('Should end', function(done) {
          video.addEventListener('ended', function() {
            done()
          })
          video.play()
        })
      }

      HTMLVideoElement.itShouldHaveProperties = function(Video) {
        videomock.test.HTMLMediaElement.itShouldHaveProperties(Video)

        describe('HTMLVideoElement properties', function() {
          var video = HTMLVideoElement.construct(Video)

          it('Should have correct attributes default values as describe in W3C', function() {
            expect(video.poster).toBe("")
            expect(video.width).toBe(0)
            expect(video.height).toBe(0)
            expect(video.videoWidth).toBe(0)
            expect(video.videoHeight).toBe(0)
          })

          it('Should have working setters implementation', function() {
            var url = "http://poster-url/poster.jpg"
            video.poster = url
            expect(video.poster).toBe(url)

            // check if type checking working on setter
            video.width = 400
            expect(video.width).toBe(400)
            video.width = '300'
            expect(video.width).toBe(300)

            video.height = 400
            expect(video.height).toBe(400)
            video.height = '300'
            expect(video.height).toBe(300)

            // Should have stay unchange, because video metadata not loaded
            expect(video.videoWidth).toBe(0)
            expect(video.videoHeight).toBe(0)

            video.width = 'sfsdfs'
            expect(video.width).toBe(0)
            video.height = 'sfsdfs'
            expect(video.height).toBe(0)
          })
        })
      }

      HTMLVideoElement.itShouldHaveMethods = function(Video) {
        var video = HTMLVideoElement.construct(Video)

        it('Should implement HTMLMediaElement methods', function() {
          expect(typeof video.getVideoPlaybackQuality).toBe('function')
          expect(typeof video.webkitEnterFullscreen).toBe('function')
          expect(typeof video.webkitExitFullscreen).toBe('function')
          expect(typeof video.webkitEnterFullScreen).toBe('function')
          expect(typeof video.webkitExitFullScreen).toBe('function')
        })
      }

      return HTMLVideoElement;
    })();
    test.HTMLVideoElement = HTMLVideoElement;
  })(test = videomock.test || (videomock.test = {}));
})(videomock || (videomock = {}));
