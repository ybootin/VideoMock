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
  var src;

  beforeEach(function() {
    video = new videomock.HTMLVideoMock()
    src = videomock.VideoMockURL.gen({
      'duration': 2
    })
    video.src = src
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

  it('Should not start loading if preload=none and load() not called', function(done) {
    video = new videomock.HTMLVideoMock()
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
    video = new videomock.HTMLVideoMock()

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
    video = new videomock.HTMLVideoMock()

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
})
