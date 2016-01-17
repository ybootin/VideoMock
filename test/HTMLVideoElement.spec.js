if (!/PhantomJS/.test(window.navigator.userAgent)) {
  describe('W3C DOM HTMLVideoElement', function() {
    videomock.test.HTMLVideoElement.itShouldHaveProperties('video')
    videomock.test.HTMLVideoElement.itShouldWork('video')
    videomock.test.HTMLVideoElement.itShouldWorkInDOM('video')
  })
}
