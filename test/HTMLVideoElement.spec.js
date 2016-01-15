if (!/PhantomJS/.test(window.navigator.userAgent)) {
  describe('W3C DOM HTMLVideoElement', function() {
    videomock.test.HTMLMediaElement.itShouldHaveProperties('video')
  })
}
