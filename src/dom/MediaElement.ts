/// <reference path="../event/EventHandler.ts" />
/// <reference path="../event/MediaEvent.ts" />
/// <reference path="../constant/Common.ts" />
/// <reference path="../constant/MediaElement.ts" />
/// <reference path="../constant/Preload.ts" />
/// <reference path="../helper/ObjectHelper.ts" />
/// <reference path="TimeRanges.ts" />

namespace videomock.dom {


  // Must type constructor to define static properties
  export interface IMediaElementConstructor {
    new(): HTMLMediaElement
    (): void
  }

  // Must be a function to re-init default values on each call
  let getProperties: Function = function(): helper.IObjectHelperProperties {
    let prop: Function = helper.ObjectHelper.createObjectProperty

    // remember, don't need to define type for getter only attribute,
    // because type is only for type checking on setter
    return {
      // getters only
      'buffered': prop(false, new TimeRanges()),
      'duration': prop(false, NaN),
      'ended': prop(false, false),
      'error': prop(false, null),
      'networkState': prop(false, constant.MediaElement.NETWORK_EMPTY),
      'paused': prop(false, true),
      'played': prop(false, new TimeRanges()),
      'readyState': prop(false, constant.MediaElement.HAVE_NOTHING),
      'seekable': prop(false, new TimeRanges()),
      'seeking': prop(false, false),
      'currentSrc': prop(false, ""),

      // getters + setters
      'autoplay': prop(true, false, 'boolean'),
      'controls': prop(true, false, 'boolean'),
      'currentTime': prop(true, 0, 'number'),
      'loop': prop(true, false, 'boolean'),
      'muted': prop(true, false, 'boolean'),
      'defaultMuted': prop(true, false, 'boolean'),
      'playbackRate': prop(true, 1, 'number'),
      'defaultPlaybackRate': prop(true, 1, 'number'),
      'preload': prop(true, constant.Preload.DEFAULT, 'string'),
      'src': prop(true, "", 'string'),
      'volume': prop(true, constant.Common.DEFAULT_VOLUME, 'number'),

      // FIXME : Not implemented for the moment
      'audioTracks': prop(false, undefined),
      'textTracks': prop(false, undefined),
      'videoTracks': prop(false, undefined),
    }
  }

  /**
   * DOM MediaElement implementation.
   *
   * @see http://dev.w3.org/html5/spec-preview/media-elements.html#htmlmediaelement
   */
  /* tslint:disable:variable-name */
  export var MediaElement: IMediaElementConstructor = <IMediaElementConstructor>function(): void {
  /* tslint:enable:variable-name */
    // init properties defaults values
    helper.ObjectHelper.initPropertiesValues(this, getProperties())

    // Dedicated, this one won't have getter/setter
    this._eventHandler = new event.EventHandler();
  }

  MediaElement.prototype = Object.create(HTMLElement.prototype)

  // gen getters/ setters [haveGetter, haveSetter ]
  // will generate properties, and _get _set prototype
  helper.ObjectHelper.genGettersSetters(MediaElement, getProperties())

  // Override default setter to prevent wrong value !
  MediaElement.prototype._set_preload = function(value: string): void {
    switch (value) {
      case constant.Preload.NONE:
      case constant.Preload.METADATA:
        this._preload = value
        break
      // This how chrome work
      case constant.Preload.AUTO:
      case constant.Preload.EMPTY:
      default:
        this._preload = constant.Preload.AUTO
        break
    }
  }

  // Check volume range
  MediaElement.prototype._set_volume = function(value: number): void {
    value = helper.ObjectHelper.toNumber(value)

    if (typeof value !== 'number' || value > 1 || value < 0) {
      throw 'Failed to set the \'volume\' property on \'MediaElement\': The volume provided (' + value + ') is outside the range [0, 1]'
    } else {
      this._volume = value
    }
  }

  // Prevent oversize and negative size
  MediaElement.prototype._set_currentTime = function(value: number): void {
    value = helper.ObjectHelper.toNumber(value)

    if (typeof value === 'number' && !isNaN(value)) {
      if (value < 0) {
        this._currentTime = 0
      } else if (value > this.duration) {
        this._currentTime = this.duration
      } else {
        this._currentTime = value
      }
    }
  }

  /**
   * Override addEventListener to handle dedicated media event.
   */
  MediaElement.prototype.addEventListener = function(type: string, listener: EventListener, useCapture: boolean = false): void {
    if (!!event.MediaEvent[type]) {
      this._eventHandler.addEventListener(type, listener, useCapture)
    } else {
      // Super call
      HTMLElement.prototype.addEventListener.call(this, type, listener, useCapture)
    }
  }

  MediaElement.prototype._dispatchEvent = function(eventName: string, eventData?: any): void {
    let evt: CustomEvent = new CustomEvent(eventName, eventData)

    this._handleEvent(evt)
  }

  MediaElement.prototype._handleEvent = function(evt: CustomEvent): void {
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
  MediaElement.prototype.canPlayType = function(type: string): string {
    // as it's a mock, will always return `probably`
    return 'probably'
  }

  // Methods to be overriden !
  /* tslint:disable */
  MediaElement.prototype.load = function(): void {}
  MediaElement.prototype.pause = function(): void {}
  MediaElement.prototype.play = function(): void {}
  /* tslint:enable */
}
