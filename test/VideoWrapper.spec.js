describe('videomock.VideoWrapper', function() {
  // test wrapper with videoMock
  // this implementation allow to use videomock.test.HTMLVideoElement helper, which need no argument in constructor
  var VideoWrapperImpl = function() {
    videomock.VideoWrapper.call(this, new videomock.VideoMock())
  }

  VideoWrapperImpl.prototype = videomock.VideoWrapper.prototype

  videomock.test.HTMLVideoElement.itShouldWork(VideoWrapperImpl)
})
