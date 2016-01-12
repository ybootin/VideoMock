/// <reference path="MediaElement.ts" />
/// <reference path="../constant/Common.ts" />

namespace videomock.dom {

  // Must be a function to re-init default values on each call
  var getProperties = function(): helper.IObjectHelperProperties {
    var prop = helper.ObjectHelper.createObjectProperty

    // remember, don't need to define type for getter only attribute,
    // because type is only for type checking on setter
    return {
      'poster': prop(true, '', 'string'),
      'width': prop(true, constant.Common.DEFAULT_VIDEOWIDTH, 'number'),
      'height': prop(true, constant.Common.DEFAULT_VIDEOHEIGHT, 'number'),
      'videoHeight': prop(false, 0),
      'videoWidth': prop(false, 0),
    }
  }

  /**
   *  HTMLVideoElement implementation.
   *
   * @see http://dev.w3.org/html5/spec-preview/the-video-element.html#the-video-element
   */
  export var VideoElement = function() {
    // init properties defaults values
    helper.ObjectHelper.initPropertiesValues(this, getProperties())

    // super
    MediaElement.call(this)
  }

  VideoElement.prototype = MediaElement.prototype

  // gen getters/ setters [haveGetter, haveSetter ]
  // will generate properties, and _get _set prototype
  helper.ObjectHelper.genGettersSetters(VideoElement, getProperties())

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
