/// <reference path="../event/EventHandler.ts" />
/// <reference path="../event/MediaEvent.ts" />
/// <reference path="../constant/Common.ts" />
/// <reference path="../helper/ObjectHelper.ts" />
/// <reference path="TimeRanges.ts" />
/// <reference path="DomElement.ts" />

namespace videomock.dom {
  /**
   * Abstract HTMLMediaElement implementation.
   *
   * @see http://dev.w3.org/html5/spec-preview/media-elements.html#htmlmediaelement
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
   */
  export class MediaElement extends DomElement {

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
    protected _readyState: number = MediaElement.HAVE_NOTHING;
    protected _seekable: TimeRanges = new TimeRanges();
    protected _seeking: boolean = false;
    protected _src: string;
    protected _textTracks: TextTrackList; // = new TextTrackList();
    protected _videoTracks: VideoTrackList; // = new VideoTrackList();
    protected _volume: number = constant.Common.DEFAULT_VOLUME;

    //protected _handledEvents: Array<string>;

    static implement(classObject: Function): void {
      // super implementation
      DomElement.implement(classObject)

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
  }
}
