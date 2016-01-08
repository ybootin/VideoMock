
describe('HTMLVideoMock', function() {
  var video;

  beforeEach(function() {
    video = new videomock.HTMLVideoMock()
    video.src = videomock.VideoMockURL.gen({
      'duration': 1
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
