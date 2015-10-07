/// <reference path="../event/EventHandler.ts" /> 
/// <reference path="../event/MediaEvent.ts" /> 
/// <reference path="TimeRanges.ts" /> 

namespace videomock.dom {
  /**
   * HTMLMediaElement mock implementation.
   * based on typescript interface : 
   *   https://github.com/Microsoft/TypeScript/blob/master/lib/lib.dom.d.ts
   */
  export class HTMLMediaElement extends HTMLDivElement {

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
    protected _autoplay: boolean;
    protected _buffered: TimeRanges = new TimeRanges();
    protected _controls: boolean;
    protected _currentSrc: string;
    protected _currentTime: number;
    protected _defaultMuted: boolean;
    protected _defaultPlaybackRate: number;
    protected _duration: number;
    protected _ended: boolean;
    protected _error: MediaError;
    protected _loop: boolean;
    protected _muted: boolean;
    protected _networkState: number;
    protected _paused: boolean;
    protected _playbackRate: number;
    protected _played: TimeRanges = new TimeRanges();
    protected _preload: string = 'none';
    protected _readyState: number;
    protected _seekable: TimeRanges = new TimeRanges();
    protected _seeking: boolean;
    protected _src: string;
    protected _textTracks: TextTrackList = new TextTrackList();
    protected _videoTracks: VideoTrackList = new VideoTrackList();
    protected _volume: number;

    protected _eventHandler: event.EventHandler = new event.EventHandler();

    protected _handledEvents: Array<string> = [];

    /**
     * Returns an AudioTrackList object with the audio tracks for a given video element.
     */
    get audioTracks(): AudioTrackList {
      return this._audioTracks
    }

    /**
     * Gets or sets a value that indicates whether to start playing the media automatically.
     */
    get autoplay(): boolean {
      return this._autoplay
    }

    set autoplay(value: boolean) {
      this._autoplay = value
    }

    /**
     * Gets a collection of buffered time ranges.
     */
    get buffered(): TimeRanges {
      return this._buffered
    }

    /**
     * Gets or sets a flag that indicates whether the client provides a set of controls for the media (in case the developer does not include controls for the player).
     */
    get controls(): boolean {
      return this._controls
    }

    set controls(value: boolean) {
      this._controls = value
    }

    /**
     * Gets the address or URL of the current media resource that is selected by IHTMLMediaElement.
     */
    get currentSrc(): string {
      return this._currentSrc
    }

    /**
     * Gets or sets the current playback position, in seconds.
     */
    get currentTime(): number {
      return this._currentTime
    }

    set currentTime(value: number) {
      this._currentTime = value 
    }

    /**
     * The defaultMuted property sets or returns whether the audio/video should be muted by default.
     * Setting this property will only change the default muted state, not the current. To change the current muted state, use the muted property.
     */
    get defaultMuted(): boolean {
      return this._defaultMuted
    }

    set defaultMuted(value: boolean) {
      this._defaultMuted = value
    }
    /**
     * Gets or sets the default playback rate when the user is not using fast forward or reverse for a video or audio resource.
     */
    get defaultPlaybackRate(): number {
      return this._defaultPlaybackRate
    }

    set defaultPlaybackRate(value: number) {
      this._defaultPlaybackRate = value
    }
    /**
     * Returns the duration in seconds of the current media resource. A NaN value is returned if duration is not available, or Infinity if the media resource is streaming.
     */
    get duration(): number {
      return this._duration
    }

    set duration(value: number) {
      this._duration = value
    }

    /**
     * Gets information about whether the playback has ended or not.
     */
    get ended(): boolean {
      return this._ended
    }

    /**
     * Returns an object representing the current error state of the audio or video element.
     */
    get error(): MediaError {
      return this._error
    }

    /**
     * Gets or sets a flag to specify whether playback should restart after it completes.
     */
    get loop(): boolean {
      return this._loop
    }

    set loop(value: boolean) {
      this._loop = value
    }
    /**
     * Gets or sets a flag that indicates whether the audio (either audio or the audio track on video media) is muted.
     */
    get muted(): boolean {
      return this._muted
    }

    set muted(value: boolean) {
      this._muted = value
    }

    /**
     * Gets the current network activity for the element.
     */
    get networkState(): number {
      return this._networkState
    }

    /**
     * Gets a flag that specifies whether playback is paused.
     */
    get paused(): boolean {
      return this._paused
    }

    /**
     * Gets or sets the current rate of speed for the media resource to play. This speed is expressed as a multiple of the normal speed of the media resource.
     */
    get playbackRate(): number {
      return this._playbackRate
    }

    set playbackRate(value: number) {
      this._playbackRate = value
    }

    get played(): TimeRanges {
      return this._played
    }

    /**
     * The preload attribute specifies if and how the author thinks that the video should be loaded when the page loads.
     * The preload attribute allows the author to provide a hint to the browser about what he/she thinks will lead to the best user experience. This attribute may be ignored in some instances.
     * Note: The preload attribute is ignored if autoplay is present.
     *
     * values : auto|metadata|none
     */
    get preload(): string {
      return this._preload
    }

    set preload(value: string) {
      if (['auto','metadata','none'].indexOf(value) > -1) {
        this._preload = value
      }
          }

    /**
     * Returns an unsigned short (enumeration) indicating the readiness state of the media.
     */
    get readyState(): number {
      return this._readyState
    }

    /**
     * Returns a TimeRanges object that represents the ranges of the current media resource that can be seeked.
     */
    get seekable(): TimeRanges {
      return this._seekable
    }

    /**
     * Gets a flag that indicates whether the the client is currently moving to a new playback position in the media resource.
     */
    get seeking(): boolean {
      return this._seeking
    }

    /**
     * The address or URL of the a media resource that is to be considered.
     */
    get src(): string {
      return this._src
    }

    set src(value: string) {
      this._src = value 
    }

    /**
     * The textTracks property returns a TextTrackList object.
     * The TextTrackList object represents the available text tracks for the audio/video.
     * Each available text track is represented by an TextTrack Object.
     */ 
    get textTracks(): TextTrackList {
      return this._textTracks
    }

    /**
     * The videoTracks property returns a VideoTrackList object.
     * The VideoTrackList object represents the available video tracks for the video.
     * Each available video track is represented by an VideoTrack Object.
     */
    get videoTracks(): VideoTrackList {
      return this._videoTracks
    }

    /**
     * Gets or sets the volume level for audio portions of the media element.
     */
    get volume(): number {
      return this._volume
    }

    set volume(value: number) {
      this._volume = value 
    } 

    /**
     * The addTextTrack() method creates and returns a new TextTrack object.
     * The new TextTrack object is added to the list of text tracks for the audio/video element.
     */
    public addTextTrack(kind: string, label?: string, language?: string): TextTrack {
      var textTrack = new TextTrack()
      textTrack.kind = kind
      textTrack.label = label 
      textTrack.language = language

      this._textTracks[this._textTracks.length] = textTrack

      return textTrack
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
      *
      * The load() method re-loads the audio/video element.
      * The load() method is used to update the audio/video element after changing the source or other settings.
      *
      * ex : 
      *   document.getElementById("mp4_src").src = "movie.mp4";
      *   document.getElementById("ogg_src").src = "movie.ogg";
      *   document.getElementById("myVideo").load();
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
    public addEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
      if (this._getHandledEvents().indexOf(type) > -1) {
        this._eventHandler.addEventListener(type, listener, useCapture)
      } else {
        super.addEventListener(type, listener, useCapture)
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
        for (var evt in event.MediaEvent) {
          this._handledEvents.push(event.MediaEvent[evt])
        }
      }
      return this._handledEvents
    }
  }
}