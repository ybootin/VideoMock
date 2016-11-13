/// <reference path="dom/MediaElement.ts" />
/// <reference path="dom/VideoElement.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="model/ISourceData.ts" />
/// <reference path="model/IVideoMock.ts" />
/// <reference path="VideoMockURL.ts" />
/// <reference path="event/MediaEvent.ts" />
/// <reference path="constant/LoadStatus.ts" />
/// <reference path="constant/PlaybackStatus.ts" />
/// <reference path="polyfill/ProgressEvent.ts" />
/// <reference path="polyfill/CustomEvent.ts" />

namespace videomock {
  /**
   * Mocked HTMLVideoElement
   *
   * a working implementation of the HTMLVideoElement, to test Video tag without video codec
   *
   * @see HTMLVideoMock for implementation
   *
   * keep NON HTMLVideoElement attributes/methods start with _, even if they are  public scope to prevent extends conflict
   */

  export var VideoMock = <model.IVideoMock>function() {
    // super
    dom.VideoElement.call(this)

    // init attributes
    this._playbackTimerId;

    this._loadStatus = constant.LoadStatus.UNSTARTED
    this._playbackStatus = constant.PlaybackStatus.UNSTARTED

    this._bytesLoaded = 0;
    this._bytesTotal = 0;

    this._bufferCount = 0

    this._loadeddataDispatched = false

    this._sourceData = videomock.VideoMockURL.DEFAULT;
  }

  // extends
  VideoMock.prototype = Object.create(dom.VideoElement.prototype)

  // The setInterval delay for playback and progress timer
  VideoMock.PLAYBACK_TIMER_RATE = 250
  VideoMock.PROGRESS_TIMER_RATE = 250
  VideoMock.BUFFERSIZE = 1
  VideoMock.METADATASIZE = 1 //one Kb

  VideoMock.prototype.play = function(): void {
    if (this.src === '') {
      return
    }

    this._paused = false

    this._startPlaybackTimer()
  }

  VideoMock.prototype.pause = function(): void {
    if (!this.paused) {
      this._playbackStatus = constant.PlaybackStatus.PAUSED

      // stop the playback progress
      this._stopPlaybackTimer()

      this._paused = true
      this._dispatchEvent(event.MediaEvent.pause)
    }
  }

  VideoMock.prototype.load = function(): void {
    if (this._loadStatus > constant.LoadStatus.UNSTARTED || this.src === '') {
      return
    }
    // TODO handle video erro HERE

    this._loadStatus = constant.LoadStatus.LOADING

    this._currentSrc = this.src

    // as we don't handle video load, we can dispatch events right now !
    this._dispatchEvent(event.MediaEvent.loadstart)

    var intervalId: number
    var metadataSize = VideoMock.METADATASIZE * constant.Common.KB_UNIT // needed bytes download to trigger loadedmetadata event

    this._bytesTotal = this._sourceData.fileSize * constant.Common.KB_UNIT

    intervalId = setInterval((): void => {
      let addedBytes: number
      if (this._bytesLoaded < this._bytesTotal) {
        addedBytes = (VideoMock.PROGRESS_TIMER_RATE / 1000) * this._sourceData.bandwidth * constant.Common.KB_UNIT

        if ((this._bytesLoaded + addedBytes) >= this._bytesTotal) {
          addedBytes = this._bytesTotal - this._bytesLoaded

          this._bytesLoaded = this._bytesTotal

          this._networkState = constant.MediaElement.NETWORK_IDLE

          this._loadStatus = constant.LoadStatus.LOADED

          clearInterval(intervalId)
        } else {
          this._bytesLoaded += addedBytes
        }
      }

      // Handle Time range
      var loadedSeconds = addedBytes / this._bps
      if (this.buffered.length === 0) {
        this.buffered.addRange(0, loadedSeconds)
      } else {
        this._buffered.ranges[0].end += loadedSeconds
      }

      // http://www.w3.org/TR/2012/WD-html5-20121025/media-elements.html#dom-media-have_nothing
      if (this._bytesLoaded > metadataSize && this._readyState === constant.MediaElement.HAVE_NOTHING) {
        this._networkState = constant.MediaElement.NETWORK_LOADING
        this._setMetadataLoaded()
      }

      if (this.readyState >= constant.MediaElement.HAVE_METADATA) {
        let currentData = this.currentTime * this._bps
        if (this._bytesLoaded >= currentData) {
          this._readyState = constant.MediaElement.HAVE_CURRENT_DATA
        }

        // next frame
        let futureData = (this.currentTime + (1 / this._sourceData.fps)) * this._bps
        if (this._bytesLoaded >= futureData) {
          this._readyState = constant.MediaElement.HAVE_FUTURE_DATA

          if (!this._loadeddataDispatched) {
            this._loadeddataDispatched = true
            this._dispatchEvent(event.MediaEvent.loadeddata)
          }
        }

        // consider we have enough data to play 1 seconds
        // to avoid over buferring, we had buffertime each time it buffer
        let enoughDataBuffer: number = 1 //+ (this._bufferCount > 0 ? this._bufferCount / 5 : 0)
        if (this.currentTime + enoughDataBuffer >= this.duration) {
          enoughDataBuffer = this.duration - this.currentTime
        }

        let enoughData = (this._currentTime + enoughDataBuffer) * this._bps
        if (this._bytesLoaded >= enoughData) {
          this._readyState = constant.MediaElement.HAVE_ENOUGH_DATA

          if (this.autoplay && !this.paused) {
            this.play()
          }
        }
      }

      this._handleEvent(new ProgressEvent(event.MediaEvent.progress, {
        'lengthComputable': true,
        'loaded': this._bytesLoaded,
        'total': this._bytesTotal,
      }))

    }, VideoMock.PROGRESS_TIMER_RATE)
  }

  /**
   * This setters will be called when access to .width attribute
   */
  VideoMock.prototype._set_width = function(value: number): void {
    let width = this.width
    dom.VideoElement.prototype._set_width.call(this, value)

    if (width !== this.width) {
      this._updateDimensions()
    }
  }

  VideoMock.prototype._set_height = function(value: number): void {
    let height = this.height
    dom.VideoElement.prototype._set_height.call(this, value)

    if (height !== this.height) {
      this._updateDimensions()
    }
  }

  /**
   * Override src setter
   */
  VideoMock.prototype._set_src = function(value: string): void {
    if(this.src === value || this.currentSrc === value) {
      return
    }

    dom.MediaElement.prototype._set_src.call(this, value)

    if (this.src !== '') {
      this._hasStarted = false
      this._hasLoadStarted = false

      this._sourceData = VideoMockURL.parse(value)
      this._updateDimensions()

      // init bitrate
      this._bps = this._sourceData.fileSize * constant.Common.KB_UNIT / this._sourceData.duration

      if (this.autoplay) {
        this.play()
      } else if (this._shouldPreload()) {
        this.load()
      }
    } else {
      // TODO : should unload ? check spec
    }
  }

  VideoMock.prototype._set_volume = function(value: number): void {
    var volume = this.volume
    dom.MediaElement.prototype._set_volume.call(this, value)

    if (volume !== this.volume) {
      this._dispatchEvent(event.MediaEvent.volumechange)
    }
   }

  VideoMock.prototype._set_autoplay = function(value: boolean): void {
    // super call
    dom.MediaElement.prototype._set_autoplay.call(this, value)

    if (this.autoplay) {
      this.play()
    }
  }

  VideoMock.prototype._set_preload = function(value: string): void {
    // MediaElement preload will check correct input
    dom.MediaElement.prototype._set_preload.call(this, value)

    switch(this.preload) {
      case 'metadata':
        // Todo, add a pseudo preload mecanism with a timer + bandwidth calc
        // for the moment loading metadata is synschronous ...
        this._setMetadataLoaded()
        break
       case 'auto':
       case '':
         this.load()
         break
    }
  }

  VideoMock.prototype._set_currentTime = function(value: number): void {
    if (typeof value === 'number' && !isNaN(value) && this.currentTime !== value) {
      this._stopPlaybackTimer()

      this._playbackStatus = constant.PlaybackStatus.SEEKING
      this._dispatchEvent(event.MediaEvent.seeking)

      // use safe super call to set currentTime
      dom.MediaElement.prototype._set_currentTime.call(this, value)

      this._dispatchEvent(event.MediaEvent.seeked)

      this._startPlaybackTimer()
    }
  }

  /**
   * Override event dispatcher !
   * @param {Event} evt [description]
   */
  VideoMock.prototype._handleEvent = function(evt: CustomEvent): void {
    // Super call, will trigger user callback
    this._eventHandler.handleEvent(evt)

    // Event here will be executed after user callback !
    switch (evt.type) {
      case event.MediaEvent.ended:
        this._stopPlaybackTimer()
        if (this.loop) {
          this._replay()
        }
        break
    }
  }

  VideoMock.prototype._updateDimensions = function(): void {
    // we shouldn't do anything if we don't have metadata !
    if (this.readyState < constant.MediaElement.HAVE_METADATA) {
      return
    }

    // calculate base video size !
    var videoRatio: number = this._sourceData.width / this._sourceData.height
    var requestRatio: number = this.width / this.height

    // pillarbox video
    if (requestRatio > videoRatio) {
      this._videoHeight = this.height
      this._videoWidth = this.height * videoRatio
    } else { // letterbox video
      this._videoWidth = this.width
      this._videoHeight = this.width / videoRatio
    }
  }

  VideoMock.prototype._shouldPreload = function(): boolean {
    return this.preload !== constant.Preload.NONE && this.preload !== constant.Preload.METADATA
  }

  VideoMock.prototype._setMetadataLoaded = function(): void {
    if (this.readyState < constant.MediaElement.HAVE_METADATA) {

      // set metadata before dispatch loadedmetadata event
      this._duration = this._sourceData.duration

      this._dispatchEvent(event.MediaEvent.loadedmetadata)
      this._dispatchEvent(event.MediaEvent.durationchange)
      this._dispatchEvent(event.MediaEvent.canplay)
      this._dispatchEvent(event.MediaEvent.canplaythrough)

      this._readyState = constant.MediaElement.HAVE_METADATA
    }
  }

  VideoMock.prototype._startPlaybackTimer = function(): void {
    if (!this._playbackTimerId) {
      var addTimeRange = (): void => {

        if (this._loadStatus === constant.LoadStatus.UNSTARTED) {
          this.load()
        }

        // do this check at future data, to avoid play/pause constinously
        // buffering will start when don't have future data, and will end when have enough data
        if (this.readyState <= constant.MediaElement.HAVE_FUTURE_DATA) {

          // init buffering sequence
          if (this._playBackStatus !== constant.PlaybackStatus.BUFFERING) {
            this._playBackStatus = constant.PlaybackStatus.BUFFERING

            // FIXME , check if we really need this
            this._bufferCount++

            // W3C spec
            this._dispatchEvent(event.MediaEvent.waiting)
          }
          return
        }

        // calc the next timeRange from the interval
        let nextTime: number = (VideoMock.PLAYBACK_TIMER_RATE / 1000)

        // Use super call, because it handle oversize of currentTime (mean current > duration)
        // also do not use this.currentTime = , as it will dispatch seek event,
        dom.MediaElement.prototype._set_currentTime.call(this, this.currentTime + nextTime)

        if (this.currentTime >= this.duration) {
          // dispatch a final timeupdate before ended to be sure the listener are call almost once on very small video size
          this._dispatchEvent(event.MediaEvent.timeupdate)
          this._playbackStatus = constant.PlaybackStatus.ENDED
          this._dispatchEvent(event.MediaEvent.ended)
          this._stopPlaybackTimer()
        } else {
          if (this._playbackStatus !== constant.PlaybackStatus.PLAYING) {
            this._playbackStatus = constant.PlaybackStatus.PLAYING

            // will indicate playback have start or start again after buferring
            // @TODO need specifications details
            this._dispatchEvent(event.MediaEvent.play)
            this._dispatchEvent(event.MediaEvent.playing)
          }

          this._dispatchEvent(event.MediaEvent.timeupdate)
        }
      }

      this._playbackTimerId = setInterval(addTimeRange, VideoMock.PLAYBACK_TIMER_RATE)
    }
  }

  VideoMock.prototype._stopPlaybackTimer = function(): void {
    if (this._playbackTimerId) {
      clearInterval(this._playbackTimerId)
      this._playbackTimerId = null
    }
  }

  /**
   * need a replay feature for loop option
   */
  VideoMock.prototype._replay = function(): void {
    this._stopPlaybackTimer()
    this._hasStarted = false
    this.currentTime = 0
    this.play()
  }
}
