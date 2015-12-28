/// <reference path="../helper/HTMLHelper.ts" />

namespace videomock.ui {
  /**
   * Provide a simple interface for videoMock
   */
  export class VideoMockUI {
    private mainContainer: HTMLDivElement;
    private videoContainer: HTMLDivElement;
    private contentContainer: HTMLDivElement;
    private progressBar: HTMLDivElement;
    private status: string = 'unstarted';

    constructor(private video: HTMLVideoElement) {
      video.addEventListener(event.MediaEvent.timeupdate, () => this.updateDisplay())
      video.addEventListener(event.MediaEvent.loadstart, () => this.updateDisplay())
      video.addEventListener(event.MediaEvent.progress, () => this.updateDisplay())
      video.addEventListener(event.MediaEvent.ended, () => this.onEnded())
      video.addEventListener(event.MediaEvent.error, () => this.onError())
      video.addEventListener(event.MediaEvent.pause, () => this.onPaused())
      video.addEventListener(event.MediaEvent.playing, () => this.onPlay())
      video.addEventListener(event.MediaEvent.play, () => this.onPlay())

      // main container, black background will provide letterbox/pillarbox
      this.mainContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLHelper.applyStyle(this.mainContainer, {
        'position': 'relative',
        'backgroundColor': '#000000',
      })

      // simulate video size, absolutly centerd on background
      this.videoContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLHelper.applyStyle(this.videoContainer, {
        'overflow':'hidden',
        'backgroundColor':'#CCCCCC',
        'position':'absolute',
      })

      // Just to provide an animation
      this.progressBar = <HTMLDivElement>document.createElement('div')
      helper.HTMLHelper.applyStyle(this.progressBar, {
        'zIndex' :'2',
        'backgroundColor' :'#999999',
        'position': 'absolute',
        'bottom': '0px',
      })

      this.contentContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLHelper.applyStyle(this.contentContainer, {
        'fontSize' :'11px',
        'fontFamily':'monaco',
        'position':'absolute',
        'top':'0',
        'left':'0',
        'zIndex':'3',
        'padding':'10px',
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
      var percentPlayed = this.video.currentTime / this.video.duration * 100

      helper.HTMLHelper.applyStyle(this.mainContainer, {
        'width': this.video.width + 'px',
        'height': this.video.height + 'px',
      })

      helper.HTMLHelper.applyStyle(this.videoContainer, {
        'width': this.video.videoWidth + 'px',
        'height': this.video.videoHeight + 'px',
        'left': (this.video.width - this.video.videoWidth) / 2 + 'px',
        'top': (this.video.height - this.video.videoHeight) / 2 + 'px'
      })

      helper.HTMLHelper.applyStyle(this.progressBar, {
        'height': this.video.videoHeight + 'px',
        'width': percentPlayed + '%'
      })

      var content = '<h3>VideoMock info</h3>' +
        'URL: ' + this.video.src +
        '<br/>Size: ' + this.video.width + 'x' + this.video.height + ' (video : ' + Math.round(this.video.videoWidth) + 'x' + Math.round(this.video.videoHeight) + ')' +
        '<br/>Progress: ' + Math.round(this.video.currentTime) + '/' + this.video.duration + 's (' + Math.round(percentPlayed) + '%)' +
        '<br/>Volume: ' + this.video.volume +
        '<br/>Status: ' + this.status

      this.contentContainer.innerHTML = content
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
