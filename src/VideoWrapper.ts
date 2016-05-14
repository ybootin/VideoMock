/// <reference path="./dom/VideoElement.ts" />
/// <reference path="./helper/ObjectHelper.ts" />

namespace videomock {
  export var VideoWrapper = function(wrappedVideo: HTMLVideoElement) {
    this._wrappedVideo = wrappedVideo

    this._eventHandler = new event.EventHandler();

    // Wrap events
    for (let eventName in videomock.event.MediaEvent) {
      this._wrappedVideo.addEventListener(videomock.event.MediaEvent[eventName], (evt: CustomEvent): void => {
        this._handleEvent(evt)
      }, false)
    }
  }

  VideoWrapper.prototype = Object.create(HTMLElement.prototype)

  // merge properties
  let props: helper.IObjectHelperProperties = dom.getMediaElementProperties()
  let videoProps: helper.IObjectHelperProperties = dom.getVideoElementProperties()
  for (let p in videoProps) {
    props[p] = videoProps[p]
  }

  let getProperty = function(propName, haveSetter) {
    let prop: helper.IPropertyObject = <helper.IPropertyObject>{
      'enumerable': true,
      'configurable': true,
      'get': function (): any {
        return this._wrappedVideo[propName]
      },
      set: function(value: any): void { return void(value) }
    }

    if (haveSetter) {
      prop.set = function(value: any): void {
        this._wrappedVideo[propName] = value
      }
    }

    return prop
  }
  // implement getter/setters
  for (var propName in props) {
    Object.defineProperty(VideoWrapper.prototype, propName, getProperty(propName, props[propName].haveSetter))
  }

  /**
   * Override addEventListener to handle dedicated media event.
   */
  VideoWrapper.prototype.addEventListener = function(type: string, listener: EventListener, useCapture: boolean = false): void {
    if (!!event.MediaEvent[type]) {
      this._eventHandler.addEventListener(type, listener, useCapture)
    } else {
      // Super call
      HTMLElement.prototype.addEventListener.call(this, type, listener, useCapture)
    }
  }

  VideoWrapper.prototype._dispatchEvent = function(eventName: string, eventData?: any): void {
    let evt: CustomEvent = new CustomEvent(eventName, eventData)

    this._handleEvent(evt)
  }

  VideoWrapper.prototype._handleEvent = function(evt: CustomEvent): void {
    this._eventHandler.handleEvent(evt)

    // Callback handler oneventname (onplay, oncanplay ...)
    let handler: Function = this['on' + evt.type]
    if (handler && typeof handler === 'function') {
      handler(evt)
    }
  }

  /**
   * Returns a string that specifies whether the client can play a given media resource type.
   */
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
