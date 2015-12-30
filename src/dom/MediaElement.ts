/// <reference path="../event/EventHandler.ts" />
/// <reference path="../event/MediaEvent.ts" />
/// <reference path="../constant/Common.ts" />
/// <reference path="../helper/ObjectHelper.ts" />
/// <reference path="TimeRanges.ts" />

namespace videomock.dom {


  // Must type constructor to define static properties
  interface IMediaElementConstructor {
    new(): HTMLMediaElement
    (): void
    HAVE_NOTHING: number
    HAVE_METADATA: number
    HAVE_CURRENT_DATA: number
    HAVE_FUTURE_DATA: number
    HAVE_ENOUGH_DATA: number
    NETWORK_EMPTY: number
    NETWORK_IDLE: number
    NETWORK_LOADING: number
    NETWORK_NO_SOURCE: number
  }

  /**
   * DOM MediaElement implementation.
   *
   * @see http://dev.w3.org/html5/spec-preview/media-elements.html#htmlmediaelement
   */
  export var MediaElement = <IMediaElementConstructor>function() {
    // init properties values
    this._audioTracks
    this._autoplay = false;
    this._buffered = new TimeRanges();
    this._controls = false;
    this._currentSrc;
    this._currentTime = 0;
    this._defaultMuted = false;
    this._defaultPlaybackRate;
    this._duration = 0;
    this._ended = false;
    this._error;
    this._loop = false;
    this._muted = false;
    this._networkState = MediaElement.NETWORK_EMPTY;
    this._paused = false;
    this._playbackRate;
    this._played = new TimeRanges();
    this._preload = 'none';
    this._readyState = MediaElement.HAVE_NOTHING;
    this._seekable = new TimeRanges();
    this._seeking = false;
    this._src;
    this._textTracks; // = new TextTrackList();
    this._videoTracks; // = new VideoTrackList();
    this._volume = constant.Common.DEFAULT_VOLUME;

    // Dedicated, this one won't have getter/setter
    this._eventHandler = new event.EventHandler();
  }

  MediaElement.prototype = Object.create(HTMLDivElement.prototype)

  // Static properties
  MediaElement.HAVE_NOTHING = 0; // - no information whether or not the audio/video is ready
  MediaElement.HAVE_METADATA = 1; // - metadata for the audio/video is ready
  MediaElement.HAVE_CURRENT_DATA = 2; // - data for the current playback position is available, but not enough data to play next frame/millisecond
  MediaElement.HAVE_FUTURE_DATA = 3; // - data for the current and at least the next frame is available
  MediaElement.HAVE_ENOUGH_DATA = 4; // - enough data available to start playing

  MediaElement.NETWORK_EMPTY // FIXME : to be defined
  MediaElement.NETWORK_IDLE // FIXME : to be defined
  MediaElement.NETWORK_LOADING // FIXME : to be defined
  MediaElement.NETWORK_NO_SOURCE // FIXME : to be defined

  // gen getters/ setters [haveGetter, haveSetter ]
  // will generate properties, and _get _set prototype
  var properties = {
    'audioTracks': [true, false],
    'autoplay': [true, true],
    'buffered': [true, false],
    'controls': [true, true],
    'currentSrc': [true, false],
    'currentTime': [true, true],
    'defaultMuted': [true, true],
    'defaultPlaybackRate': [true, true],
    'duration': [true, false],
    'ended': [true, false],
    'error': [true, false],
    'loop': [true, true],
    'muted': [true, true],
    'networkState': [true, false],
    'paused': [true, false],
    'playbackRate': [true, true],
    'played': [true, false],
    'preload': [true, true],
    'readyState': [true, false],
    'seekable': [true, false],
    'seeking': [true, false],
    'src': [true, true],
    'textTracks': [true, false],
    'videoTracks': [true, false],
    'volume': [true, true],
  }

  for (var prop in properties) {
    helper.ObjectHelper.genGetterSetter(MediaElement, prop, properties[prop][0], properties[prop][1])
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
    this._handleEvent(new CustomEvent(eventName, eventData))

    // Callback handler oneventname (onplay, oncanplay ...)
    var handler = this['on' + eventName]
    if (handler && typeof handler === 'function') {
      handler()
    }
  }

  MediaElement.prototype._handleEvent = function(evt: CustomEvent): void {
    this._eventHandler.handleEvent(evt)
  }

  /**
   * Returns a string that specifies whether the client can play a given media resource type.
   */
  MediaElement.prototype.canPlayType = function(type: string): string {
    // as it's a mock, will always return `probably`
    return 'probably'
  }

  // Methods to be overriden !
  MediaElement.prototype.load = function(): void {}
  MediaElement.prototype.pause = function(): void {}
  MediaElement.prototype.play = function(): void {}
}
