/// <reference path="./dom/VideoElement.ts" />
/// <reference path="./helper/ObjectHelper.ts" />

namespace videomock {
  export var VideoWrapper = function(wrappedVideo: HTMLVideoElement) {
    this._wrappedVideo = wrappedVideo
  }

  // Must implement HTMLElement in order to be used as a CustomElement
  VideoWrapper.prototype = Object.create(HTMLElement.prototype)

  // merge properties
  let props: helper.IObjectHelperProperties = dom.getMediaElementProperties()
  let videoProps: helper.IObjectHelperProperties = dom.getVideoElementProperties()
  for (let p in videoProps) {
    props[p] = videoProps[p]
  }

  let addProperty = function(propName, haveSetter) {
    helper.ObjectHelper.defineProperty(VideoWrapper.prototype, propName, function(): any {
      return this._wrappedVideo[propName]
    }, function(value: any): void {
      if (haveSetter) {
        this._wrappedVideo[propName] = value
      }
    })
  }

  // implement getter/setters
  for (var propName in props) {
    addProperty(propName, props[propName].haveSetter)
  }

  VideoWrapper.prototype.addEventListener = function(type: string, listener: EventListener, useCapture: boolean = false): void {
    this._wrappedVideo.addEventListener(type, listener, useCapture)
  }

  VideoWrapper.prototype.canPlayType = function(type: string): string {
    return this._wrappedVideo.canPlayType()
  }

  VideoWrapper.prototype.load = function(): void {
    this._wrappedVideo.load()
  }
  VideoWrapper.prototype.pause = function(): void {
    this._wrappedVideo.pause()
  }
  VideoWrapper.prototype.play = function(): void {
    this._wrappedVideo.play()
  }

  // HTMLVideoElement method
  VideoWrapper.prototype.getVideoPlaybackQuality = function(): VideoPlaybackQuality {
    return this._wrappedVideo.getVideoPlaybackQuality()
  }

  VideoWrapper.prototype.webkitEnterFullscreen = function(): void {
    return this._wrappedVideo.webkitEnterFullscreen()
  }
  VideoWrapper.prototype.webkitExitFullscreen = function(): void {
    this._wrappedVideo.webkitExitFullscreen()
  }

  VideoWrapper.prototype.webkitEnterFullScreen = function(): void {
    this.webkitEnterFullscreen()
  }
  VideoWrapper.prototype.webkitExitFullScreen = function(): void {
    this.webkitExitFullscreen()
  }
}
