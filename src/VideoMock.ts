/// <reference path="dom/MediaElement.ts" />
/// <reference path="dom/VideoElement.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="model/ISourceData.ts" />
/// <reference path="VideoMockURL.ts" />
/// <reference path="event/MediaEvent.ts" />
/// <reference path="polyfill/ProgressEvent.ts" />

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
  // Must type constructor to define static properties
  interface IVideoMock {
    new (): HTMLVideoElement
    (): void
    PLAYBACK_TIMER_RATE: number
    PROGRESS_TIMER_RATE: number
  }

  export var VideoMock = <IVideoMock>function() {
    // super
    dom.VideoElement.call(this)

    // init attributes
    this._playbackTimerId;
    this._hasStarted;
    this._hasLoadStarted;
    this._bytesLoaded = 0;
    this._bytesTotal;

    this._sourceData = videomock.VideoMockURL.DEFAULT;
  }

  // extends
  VideoMock.prototype = Object.create(dom.VideoElement.prototype)

  // The setInterval delay for playback and progress timer
  VideoMock.PLAYBACK_TIMER_RATE = 100
  VideoMock.PROGRESS_TIMER_RATE = 100

  VideoMock.prototype.play = function(): void {
    // trigger load + autoplay
    if (!this._hasLoadStarted) {
      return this.load(true)
    }

    if (!this._hasStarted) {
      this._hasStarted = true
      this._dispatchEvent(event.MediaEvent.play)
      this._dispatchEvent(event.MediaEvent.playing)

      // And now simulate playback !
      this._startPlaybackTimer()
    } else if (this._paused) {
      this._paused = false
      this._dispatchEvent(event.MediaEvent.play)
      this._dispatchEvent(event.MediaEvent.playing)
    }
  }

  VideoMock.prototype.pause = function(): void {
    if (!this._paused) {
      this._paused = true
      this._dispatchEvent(event.MediaEvent.pause)
    }
  }

  VideoMock.prototype.load = function(autoplay ?: boolean): void {
    if (this._hasLoadStarted || !this._src) {
      return
    }

    // TODO handle video erro HERE

    this._hasLoadStarted = true

    this._currentSrc = this._src

    // as we don't handle video load, we can dispatch events right now !
    this._dispatchEvent(event.MediaEvent.loadstart)

    var intervalId: number
    var prevLoaded = 0
    var metadataSize = 10 // needed kb download to trigger loadedmetadata event
    var fps = 24

    this._bytesTotal = this._sourceData.fileSize * constant.Common.KB_UNIT

    intervalId = setInterval((): void => {
      if (this._bytesLoaded < this._bytesTotal) {
        prevLoaded = this._bytesLoaded
        this._bytesLoaded += (VideoMock.PROGRESS_TIMER_RATE / 1000) * this._sourceData.bandwidth * constant.Common.KB_UNIT
      }

      // Load is ended
      if (this._bytesLoaded === this._bytesTotal || this._bytesLoaded >= this._bytesTotal) {
        this._networkState = dom.MediaElement.NETWORK_IDLE

        clearInterval(intervalId)
      }

      // add a buffered timeRange
      this._buffered.addRange(prevLoaded, this._bytesLoaded)

      let blkb = this._bytesLoaded / constant.Common.KB_UNIT

       // http://www.w3.org/TR/2012/WD-html5-20121025/media-elements.html#dom-media-have_nothing
      if (blkb > metadataSize && this._readyState === dom.MediaElement.HAVE_NOTHING) {
        this._networkState = dom.MediaElement.NETWORK_LOADING
        this._setMetadataLoaded()
      }

      if (this._readyState >= dom.MediaElement.HAVE_METADATA) {
        let currentData = this._currentTime * this._bps
        if (this._bytesLoaded >= currentData) {
          this._readyState = dom.MediaElement.HAVE_CURRENT_DATA
        }

        // next frame
        let futureData = (this._currentTime + (1 / fps)) * this._bps
        if (this._bytesLoaded >= futureData) {
          this._readyState = dom.MediaElement.HAVE_FUTURE_DATA
        }

        // consider we have enough data to play 1 seconds
        let enoughData = (this._currentTime + 1) * this._bps
        if (this._bytesLoaded >= enoughData) {
          this._readyState = dom.MediaElement.HAVE_ENOUGH_DATA

          if (this._autoplay || autoplay) {
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
      this._width = (typeof value !== 'undefined' && value !== null && !isNaN(value)) ? value : constant.Common.DEFAULT_VIDEOWIDTH
      this._updateDimensions()
  }
  VideoMock.prototype._set_height = function(value: number): void {
      this._height = (typeof value !== 'undefined' && value !== null && !isNaN(value)) ? value : constant.Common.DEFAULT_VIDEOHEIGHT
      this._updateDimensions()
    }

    /**
     * Override event dispatcher !
     * @param {Event} evt [description]
     */
  VideoMock.prototype._handleEvent = function(evt: CustomEvent): void {
    // Super call
    this._eventHandler.handleEvent(evt)

    // Event here will be executed after user callback !
    switch (evt.type) {
      case event.MediaEvent.ended:
        this._stopPlaybackTimer()
        if (this._loop) {
          this._replay()
        }
        break
    }
  }

  VideoMock.prototype._updateDimensions = function(): void {
    // calculate base video size !
    var videoRatio: number = this._sourceData.width / this._sourceData.height
    var requestRatio: number = this._width / this._height

    // pillarbox video
    if (requestRatio > videoRatio) {
      this._videoHeight = this._height
      this._videoWidth = this._height * videoRatio
    } else { // letterbox video
      this._videoWidth = this._width
      this._videoHeight = this._width / videoRatio
    }
  }

  /**
   * Override src setter
   */
  VideoMock.prototype._set_src = function(value: string): void {
    if(this._src === value || this._currentSrc === value) {
      return
    }

    this._src = value
    this._hasStarted = false
    this._hasLoadStarted = false

    this._sourceData = VideoMockURL.parse(value)
    this._updateDimensions()

    // init bitrate
    this._bps = this._sourceData.fileSize * constant.Common.KB_UNIT / this._sourceData.duration

    if (this._preload || this._autoplay) {
      this.load()
    }
  }

  VideoMock.prototype._set_volume = function(value: number): void {
    this._volume = value
    this._dispatchEvent(event.MediaEvent.volumechange)
   }

  VideoMock.prototype._set_autoplay = function(value: boolean): void {
    this._autoplay = value
    this.play()
  }

  VideoMock.prototype._set_preload = function(value: string): void {
    this._preload = value

    switch(value) {
      case 'metadata':
        this._setMetadataLoaded()
        break
       case 'auto':
       case '':
         this.load()
         break
    }
  }

  VideoMock.prototype._setMetadataLoaded = function(): void {
    if (this._readyState < dom.MediaElement.HAVE_METADATA) {
      this._dispatchEvent(event.MediaEvent.loadeddata)

      // set metadata before dispatch loadedmetadata event
      this._duration = this._sourceData.duration

      this._dispatchEvent(event.MediaEvent.loadedmetadata)
      this._dispatchEvent(event.MediaEvent.durationchange)
      this._dispatchEvent(event.MediaEvent.canplay)
      this._dispatchEvent(event.MediaEvent.canplaythrough)

      this._readyState = dom.MediaElement.HAVE_METADATA
    }
  }

  VideoMock.prototype._startPlaybackTimer = function(): void {
    if (!this._playbackTimerId) {
      this._playbackTimerId = setInterval((): void => {

        if (!this._paused) {
          // doesn't have enough data to continue
          if (this._readyState < dom.MediaElement.HAVE_FUTURE_DATA) {
            this._dispatchEvent(event.MediaEvent.waiting)
            return
          }

          this._currentTime = this._currentTime + (VideoMock.PLAYBACK_TIMER_RATE / 1000)
          if (this._currentTime >= this._duration) {
            this._currentTime = this._duration
            this._dispatchEvent(event.MediaEvent.ended)
            this._stopPlaybackTimer()
          } else {
            this._dispatchEvent(event.MediaEvent.timeupdate)
          }
        }
      }, VideoMock.PLAYBACK_TIMER_RATE)
    }
  }

  VideoMock.prototype._stopPlaybackTimer = function(): void {
    if (this._playbackTimerId) {
      clearInterval(this._playbackTimerId)
    }
  }

  VideoMock.prototype._replay = function(): void {
    this._stopPlaybackTimer()
    this._currentTime = 0
    this._readyState = dom.MediaElement.HAVE_FUTURE_DATA
    this._hasStarted = false
    this._hasLoadStarted = false
    this.play()
  }
}
