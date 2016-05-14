/// <reference path="MediaElement.ts" />
/// <reference path="../helper/ObjectHelper.ts" />
/// <reference path="../constant/Common.ts" />

namespace videomock.dom {

  export interface IVideoElementProperty {
    poster: helper.IObjectHelperProperty
    width: helper.IObjectHelperProperty
    height: helper.IObjectHelperProperty
    videoHeight: helper.IObjectHelperProperty
    videoWidth: helper.IObjectHelperProperty
  }

  // Must be a function to re-init default values on each call
  export var getVideoElementProperties: Function = function(): IVideoElementProperty {
    let prop: Function = helper.ObjectHelper.createObjectProperty

    // remember, don't need to define type for getter only attribute,
    // because type is only for type checking on setter
    return {
      'poster': prop(true, '', 'string'),
      'width': prop(true, 0, 'number'),
      'height': prop(true, 0, 'number'),
      'videoHeight': prop(false, 0),
      'videoWidth': prop(false, 0),
    }
  }

  /**
   *  HTMLVideoElement implementation.
   *
   * @see http://dev.w3.org/html5/spec-preview/the-video-element.html#the-video-element
   */
  /* tslint:disable:variable-name */
  export var VideoElement: Function = function(): void {
  /* tslint:enable:variable-name */

    // init properties defaults values
    helper.ObjectHelper.initPropertiesValues(this, getVideoElementProperties())

    // super
    MediaElement.call(this)
  }

  VideoElement.prototype = MediaElement.prototype

  // gen getters/ setters [haveGetter, haveSetter ]
  // will generate properties, and _get _set prototype
  helper.ObjectHelper.genGettersSetters(VideoElement, getVideoElementProperties())

  // HTMLVideoElement method
  VideoElement.prototype.getVideoPlaybackQuality = function(): VideoPlaybackQuality {
    return <VideoPlaybackQuality><any>{}
  }

  // To be overidden
  /* tslint:disable */
  VideoElement.prototype.webkitEnterFullscreen = function(): void {}
  VideoElement.prototype.webkitExitFullscreen = function(): void {}
  /* tslint:enable */

  VideoElement.prototype.webkitEnterFullScreen = function(): void {
    this.webkitEnterFullscreen()
  }
  VideoElement.prototype.webkitExitFullScreen = function(): void {
    this.webkitExitFullscreen()
  }
}
