/**
 * HTMLVideoMock unit test
 *
 * @todo:
 *   - test all attributes
 *   - test all DOM attribute (via setAttribute / getAttribute)
 *   - test all methods
 *   - test all events
 *   - full chain tests (from instanciation to end)
 */


describe('HTMLVideoMock', function() {
  var video;

  beforeEach(function() {
    video = new videomock.HTMLVideoMock()
    video.src = videomock.VideoMockURL.gen({
      'duration': 2
    })
  });

  it('Should append to DOM as an HTMLDivElement', function() {
    window.document.body.appendChild(video)
  })

  it('Should start playback', function(done) {
    video.addEventListener('play', function() {
      done()
    })

    video.play()
  })

  it('Should not start loading if not preload or load() call', function(done) {
    video = new videomock.HTMLVideoMock()

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
      }
    }, 1000)

    video.src = videomock.VideoMockURL.gen({
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
    video.addEventListener('loadeddata', function() {
      done()
    })

    video.load()
  })

  it('Should handle preload attribute', function(done) {
    video.addEventListener('loadeddata', function() {
      done()
    })

    video.preload = 'auto'
  })

  it('Should handle preload metadata', function(done) {
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
      }
    }, 1000)

    video.preload = 'metadata'
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
})
