/// <reference path="MediaElement.ts" />

namespace videomock.dom {
  /**
   * Abstract HTMLVideoElement implementation.
   *
   * @see http://dev.w3.org/html5/spec-preview/the-video-element.html#the-video-element
   */
  export var VideoElement = function() {
    // super
    MediaElement.call(this)

    // init properties
    this._poster;
    this._width = 0;
    this._height = 0;
    this._videoHeight = 0;
    this._videoWidth = 0;
  }

  VideoElement.prototype = MediaElement.prototype

  var properties = {
    'poster': [true, true],
    'width': [true, true],
    'height': [true, true],
    'videoHeight': [true, false],
    'videoWidth': [true, false],
  }

  for (var prop in properties) {
    helper.ObjectHelper.genGetterSetter(VideoElement, prop, properties[prop][0], properties[prop][1])
  }

  // HTMLVideoElement method
  VideoElement.prototype.getVideoPlaybackQuality = function(): VideoPlaybackQuality {
    return <VideoPlaybackQuality><any>{}
  }

  // To be overidden
  VideoElement.prototype.webkitEnterFullscreen = function(): void {}
  VideoElement.prototype.webkitExitFullscreen = function(): void {}


  VideoElement.prototype.webkitEnterFullScreen = function(): void {
    this.webkitEnterFullscreen()
  }
  VideoElement.prototype.webkitExitFullScreen = function(): void {
    this.webkitExitFullscreen()
  }
}
