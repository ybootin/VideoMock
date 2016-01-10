
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

    video.preload
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
