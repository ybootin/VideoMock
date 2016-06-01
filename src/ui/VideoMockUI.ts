/// <reference path="../helper/HTMLElementHelper.ts" />
/// <reference path="../event/MediaEvent.ts" />
/// <reference path="../dom/MediaElement.ts" />
/// <reference path="../model/IVideoMock.ts" />

namespace videomock.ui {
  /**
   * Provide a simple interface for videoMock
   */
  export class VideoMockUI {
    private mainContainer: HTMLDivElement;
    private videoContainer: HTMLDivElement;
    private contentContainer: HTMLDivElement;
    private progressBar: HTMLDivElement;
    private percentLoaded: number
    private status: string = 'unstarted';

    constructor(private video: model.IVideoMock) {
      video.addEventListener(event.MediaEvent.progress, (evt: Event) => {
        this.percentLoaded = video.buffered.end(video.buffered.length - 1) / video.duration
        this.updateDisplay()
      })
      video.addEventListener(event.MediaEvent.timeupdate, () => {
        this.updateDisplay()
        this.updateTimeRanges()
      })
      video.addEventListener(event.MediaEvent.loadstart, () => this.updateDisplay())
      video.addEventListener(event.MediaEvent.progress, () => this.updateDisplay())
      video.addEventListener(event.MediaEvent.ended, () => this.onEnded())
      video.addEventListener(event.MediaEvent.error, () => this.onError())
      video.addEventListener(event.MediaEvent.pause, () => this.onPaused())
      video.addEventListener(event.MediaEvent.playing, () => this.onPlay())
      video.addEventListener(event.MediaEvent.play, () => this.onPlay())

      video.addEventListener(event.MediaEvent.waiting, () => this.onWaiting())

      // main container, black background will provide letterbox/pillarbox
      this.mainContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLElementHelper.applyStyle(this.mainContainer, {
        'position': 'relative',
        'backgroundColor': '#000000',
      })

      // simulate video size, absolutly centerd on background
      this.videoContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLElementHelper.applyStyle(this.videoContainer, {
        'overflow': 'hidden',
        'backgroundColor': '#CCCCCC',
        'position': 'absolute',
      })

      // Just to provide an animation
      this.progressBar = <HTMLDivElement>document.createElement('div')
      helper.HTMLElementHelper.applyStyle(this.progressBar, {
        'zIndex': '2',
        'backgroundColor': '#999999',
        'position': 'absolute',
        'bottom': '0px',
      })

      this.contentContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLElementHelper.applyStyle(this.contentContainer, {
        'fontSize': '11px',
        'fontFamily': 'monaco',
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'zIndex': '3',
        'padding': '10px',
      })

      this.videoContainer.appendChild(this.progressBar)
      this.videoContainer.appendChild(this.contentContainer)
      this.mainContainer.appendChild(this.videoContainer)

      this.updateDisplay()
    }

    public getContainer(): HTMLDivElement {
      return this.mainContainer
    }

    public updateDisplay(): void {
      let percentPlayed: number = this.video.currentTime / this.video.duration * 100

      helper.HTMLElementHelper.applyStyle(this.mainContainer, {
        'width': this.video.width + 'px',
        'height': this.video.height + 'px',
      })

      helper.HTMLElementHelper.applyStyle(this.videoContainer, {
        'width': this.getVideoWidth() + 'px',
        'height': this.getVideoHeight() + 'px',
        'left': (this.video.width - this.getVideoWidth()) / 2 + 'px',
        'top': (this.video.height - this.getVideoHeight()) / 2 + 'px',
      })

      helper.HTMLElementHelper.applyStyle(this.progressBar, {
        'height': this.getVideoHeight() + 'px',
        'width': percentPlayed + '%',
      })

      let content: string = '<h3>VideoMock info</h3>' +
        'URL: ' + this.video.src +
        '<br/>Size: ' + this.video.width + 'x' + this.video.height + ' (video : ' + Math.round(this.getVideoWidth()) + 'x' + Math.round(this.getVideoHeight()) + ')' +
        '<br/>Load : ' + Math.round(this.percentLoaded * this.video._sourceData.fileSize) + '/' + this.video._sourceData.fileSize + 'Ko (' + (Math.round(this.percentLoaded * 100)) + '%), bandwidth : ' + this.video._sourceData.bandwidth + 'kbps' +
        '<br/>Playback: ' + Math.round(this.video.currentTime) + '/' + this.video.duration + 's (' + Math.round(percentPlayed) + '%)' +
        '<br/>Volume: ' + this.video.volume +
        '<br/>Status: ' + this.status

      this.contentContainer.innerHTML = content
    }

    public updateTimeRanges(): void {
      if (!this.video.played.length) {
        this.video.played.addRange(0, this.video.currentTime)
      } else {
        this.video.played.ranges[0].start = 0
        this.video.played.ranges[0].end = this.video.currentTime
      }
    }

    private getVideoWidth(): number {
      return this.video.videoWidth || constant.Common.DEFAULT_VIDEOWIDTH
    }

    private getVideoHeight(): number {
      return this.video.videoHeight || constant.Common.DEFAULT_VIDEOHEIGHT
    }

    private onWaiting(): void {
      this.status = 'buffering'
      this.updateDisplay()
    }

    private onPaused(): void {
      this.status = 'paused'
      this.updateDisplay()
    }

    private onPlay(): void {
      this.status = 'playing'
      this.updateDisplay()
    }

    private onEnded(): void {
      this.status = 'ended'
      this.updateDisplay()
    }

    private onError(): void {
      this.status = 'error'
      this.updateDisplay()
    }
  }
}
