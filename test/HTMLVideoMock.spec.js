
describe('HTMLVideoMock', function() {
  var video;

  it('Should instanciate', function() {
    video = new videomock.HTMLVideoMock()
  });

  it('Should append to DOM as an HTMLDivElement', function() {
    window.document.body.appendChild(video)
  })

  it('Should start playback', function(done) {
    video.addEventListener('play', function() {
      done()
    })
    video.src = videomock.VideoMockURL.gen({
      'duration': 2
    })
    video.play()
  })

  it('Should load progress', function(done) {
    video.addEventListener('progress', function() {
      done()
    })
  })

  it('Should timeupdate', function(done) {
    video.addEventListener('timeupdate', function() {
      done()
    })
  })

  it('Should end', function(done) {
    video.addEventListener('ended', function() {
      done()
    })
  })
})
