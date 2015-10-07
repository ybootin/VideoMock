/// <reference path="dom/HTMLVideoElement.ts" /> 
/// <reference path="dom/VideoContainer.ts" /> 
/// <reference path="model/ISourceData.ts" /> 
/// <reference path="constant/Source.ts" /> 
/// <reference path="event/MediaEvent.ts" /> 

namespace videomock {
  export class VideoMock extends dom.HTMLVideoElement {

    private _playbackTimerId: number

    private _hasStarted: boolean;

    private _container: HTMLDivElement;

    private _videoDisplay: dom.VideoContainer;

    set src(value: string) {
      this._src = value
      this._currentSrc = this.src

      // try to parse src, or use default value
      var data: model.ISourceData 

      try {
        data = constant.Source.getDataFromSource(value)
      } catch (e) {
        data = constant.Source.getDataFromSource(constant.Source.VIDEO_640x360_30S)
      }
      
      // as we don't handle video load, we can dispatch events right now !
      this._dispatchEvent(event.MediaEvent.loadstart)

      // When set src, video will always load 1Mo per second !
      var intervalId: number 
      var virtualSize: number = 3000 // size of the mediafile in Ko
      var prevLoaded = 0
      var loaded = 0 
      var step = 100
      var first: boolean = true
      intervalId = setInterval((): void => {
        prevLoaded = loaded
        loaded += step * 1000

        if (loaded >= virtualSize) {
          loaded = virtualSize * 1000
        }

        if (loaded === virtualSize) {
          clearInterval(intervalId)
        }

        if (first) {
          first = false
          this._dispatchEvent(event.MediaEvent.loadeddata)

          // set metadata before dispatch loadedmetadata event
          this._duration = data.duration 
          this._videoWidth = data.width 
          this._videoHeight = data.height

          this._dispatchEvent(event.MediaEvent.loadedmetadata)
          this._dispatchEvent(event.MediaEvent.durationchange)
          this._dispatchEvent(event.MediaEvent.canplay)
          this._dispatchEvent(event.MediaEvent.canplaythrough)
        }

        // add a buffered timeRange
        this._buffered.addRange(prevLoaded, loaded) 

        this._handleEvent(new ProgressEvent(event.MediaEvent.progress, {
          'lengthComputable': true, 
          'loaded': loaded, 
          'total': virtualSize * 1000
        }))
      }, step)

      if (this.autoplay) {
        this.play()
      }
    }

    /**
     * headless video ... Will never implement this
     */
    get controls(): boolean {
      return false
    }

    set videoWidth(value: number) {
      this._videoWidth = value
      this._videoDisplay.width = this.videoWidth
    }

    set videoHeight(value: number) {
      this._videoHeight = value
      this._videoDisplay.height = this.videoHeight
    }

    set currentTime(value: number) {
      this._currentTime = value

      // @todo ==> seek !!!
    }

    public play(): void {
      this.paused = false

      if (!this._hasStarted) {
        this._hasStarted = true
        this._dispatchEvent(event.MediaEvent.play)
        
        // And now simulate playback !
        this._startPlaybackTimer()
      } else {
        this._dispatchEvent(event.MediaEvent.playing)
      }

      // Handle display 
      this._createDisplay()
    }

    public pause(): void {
      if (!this.paused) {
        this.paused = true
      }
    }

    public load(): void {
      this.src = this._src
    }

    protected _createDisplay(): void {
      this._videoDisplay = new dom.VideoContainer()
      this.appendChild(this._videoDisplay.getContainer())
    }



    protected _startPlaybackTimer(): void {
      if (!this._playbackTimerId) {
        var step: number = 100
        this._playbackTimerId = setInterval((): void => {
          if (!this.paused) {
            // currentTime is in seconds !
            this.currentTime += step / 1000

            if (this.currentTime >= this.duration) {
              this._currentTime = this.duration 
              this._dispatchEvent(event.MediaEvent.ended)
              this._stopPlaybackTimer()
            } else {
              this._dispatchEvent(event.MediaEvent.timeupdate)
            }

            this._videoDisplay.updateDisplay()
          }
        }, step)
      }
    }

    protected _stopPlaybackTimer(): void {
      if (this._playbackTimerId) {
        clearInterval(this._playbackTimerId)
      }
    }

    protected _replay(): void {
      this._stopPlaybackTimer()
      this.currentTime = 0
      this.play()
    }

    protected _handleEvent(evt: Event): void {
      switch (evt.type) {
        case event.MediaEvent.ended: 
          if (this.loop) {
            this._replay()
          }
          break
        case event.MediaEvent.timeupdate:
          this._videoDisplay.setCurrentTime(this.currentTime)
          break
      }

      super._handleEvent(evt)
    }
  }
}