/// <reference path="../event/EventHandler.ts" /> 
/// <reference path="../event/MediaEvent.ts" /> 
/// <reference path="../constant/Common.ts" /> 
/// <reference path="../helper/ObjectHelper.ts" /> 
/// <reference path="TimeRanges.ts" /> 


namespace videomock.dom {
  /**
   * Abstract HTMLMediaElement implementation. 
   *
   * Used to implement HTMLMediaElement on any HTMLElement
   *
   * USAGE : 
   *    var Custom = Object.create(HTMLDivElement.prototype)
   *    Custom.createdCallback = function() {
   *      videomock.MediaElement.call(this)
   *    }
   *    videomock.MediaElement.implement(Custom)
   *
   *    var HTMLCustomElement = document.registerElement('media-mock', {
   *      prototype: Custom,
   *      extends: 'div'
   *    })
   * 
   * based on typescript interface : 
   *   https://github.com/Microsoft/TypeScript/blob/master/lib/lib.dom.d.ts
   */
  export class MediaElement {

    static HAVE_NOTHING: number = 0; // - no information whether or not the audio/video is ready
    static HAVE_METADATA: number = 1; // - metadata for the audio/video is ready
    static HAVE_CURRENT_DATA: number = 2; // - data for the current playback position is available, but not enough data to play next frame/millisecond
    static HAVE_FUTURE_DATA: number = 3; // - data for the current and at least the next frame is available
    static HAVE_ENOUGH_DATA: number = 4; // - enough data available to start playing
    
    static NETWORK_EMPTY: number;
    static NETWORK_IDLE: number;
    static NETWORK_LOADING: number;
    static NETWORK_NO_SOURCE: number;

    protected _audioTracks: AudioTrackList
    protected _autoplay: boolean = false;
    protected _buffered: TimeRanges = new TimeRanges();
    protected _controls: boolean = false;
    protected _currentSrc: string;
    protected _currentTime: number = 0;
    protected _defaultMuted: boolean = false;
    protected _defaultPlaybackRate: number;
    protected _duration: number = 0;
    protected _ended: boolean = false;
    protected _error: MediaError;
    protected _loop: boolean = false;
    protected _muted: boolean = false;
    protected _networkState: number = MediaElement.NETWORK_EMPTY;
    protected _paused: boolean = false;
    protected _playbackRate: number;
    protected _played: TimeRanges = new TimeRanges();
    protected _preload: string = 'none';
    protected _readyState: number;
    protected _seekable: TimeRanges = new TimeRanges();
    protected _seeking: boolean = false;
    protected _src: string;
    protected _textTracks: TextTrackList; // = new TextTrackList();
    protected _videoTracks: VideoTrackList; // = new VideoTrackList();
    protected _volume: number = constant.Common.DEFAULT_VOLUME;

    protected _eventHandler: event.EventHandler = new event.EventHandler();

    protected _handledEvents: Array<string>;

    static implement(classObject: Function): void {
      // gen getters/ setters [haveGetter, haveSetter ]
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
        helper.ObjectHelper.genGetterSetter(classObject, prop, properties[prop][0], properties[prop][1])
      }

      classObject.prototype.canPlayType = function(type: string): string {
        return MediaElement.prototype.canPlayType.call(this, type)
      }

      classObject.prototype.load = function(): void {
        MediaElement.prototype.load.call(this)
      }

      classObject.prototype.pause = function(): void {
        MediaElement.prototype.pause.call(this)
      }


      classObject.prototype.play = function(): void {
        MediaElement.prototype.play.call(this)
      }

      classObject.prototype.addEventListener = function(type: string, listener: EventListener, useCapture: boolean = false): void {
        MediaElement.prototype.addEventListener.call(this, type, listener, useCapture)
      }

      classObject.prototype._dispatchEvent = function(eventName: string, eventData?: any): void {
        MediaElement.prototype._dispatchEvent.call(this, eventName, eventData)
      }

      classObject.prototype._handleEvent = function(evt: Event): void {
        MediaElement.prototype._handleEvent.call(this, evt)
      }

      classObject.prototype._getHandledEvents = function(): Array<string> {
        return MediaElement.prototype._getHandledEvents.call(this)
      }
    }

    /**
     * Returns a string that specifies whether the client can play a given media resource type.
     */
    public canPlayType(type: string): string {
      // as it's a mock, will always return `probably`
      return 'probably'
    }

    /**
     * Fires immediately after the client loads the object.
     */
    public load(): void {
      throw 'to be implemented !'
    }

    /**
     * Pauses the current playback and sets paused to TRUE. This can be used to test whether the media is playing or paused. You can also use the pause or play events to tell whether the media is playing or not.
     */
    public pause(): void {
      throw 'to be implemented !'
    }

    /**
     * Loads and starts playback of a media resource.
     */
    public play(): void {
      throw 'to be implemented !'
    }

    /**
     * Override addEventListener to handle dedicated media event.
     */
    public addEventListener(type: string, listener: EventListener, useCapture: boolean = false): void {
      if (this._getHandledEvents().indexOf(type) > -1) {
        this._eventHandler.addEventListener(type, listener, useCapture)
      } else {
        // Super call
        HTMLElement.prototype.addEventListener.apply(this, arguments)
      }
    }

    protected _dispatchEvent(eventName: string, eventData?: any): void {
      this._handleEvent(new CustomEvent(eventName, eventData))
    }

    protected _handleEvent(evt: Event): void {
      this._eventHandler.handleEvent(evt)
    }

    protected _getHandledEvents(): Array<string> {
      // avoid loop on mediaEvent each time
      if (!this._handledEvents) {
        this._handledEvents = []
        for (var evt in event.MediaEvent) {
          this._handledEvents.push(event.MediaEvent[evt])
        }
      }
      return this._handledEvents
    }
  }
}