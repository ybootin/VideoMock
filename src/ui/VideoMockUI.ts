/// <reference path="../helper/HTMLHelper.ts" />

namespace videomock.ui {
  /**
   * Provide a simple interface for videoMock
   */
  export class VideoMockUI {
    private mainContainer: HTMLDivElement;
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

      // main container, will
      this.mainContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLHelper.applyStyle(this.mainContainer, {
        'position': 'relative',
        'backgroundColor': '#000000',
      })

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

      var tmpl = '<div style="overflow:hidden;width:' + this.video.videoWidth + 'px;height:' + this.video.videoHeight + 'px;background-color:#CCCCCC;position:absolute;left:' + (this.video.width - this.video.videoWidth) / 2 + 'px;top:' + (this.video.height - this.video.videoHeight) / 2 + 'px">' +
        '<div style="z-index:2;background-color:#999999;position:absolute;bottom:0px;height:' + this.video.videoHeight + 'px;width:' + percentPlayed + '%"></div>' +
        '<div style="font-size:11px;font-family:monaco;position:absolute;top:0;left:0;z-index:2;padding:10px;">' +
        '<h3>VideoMock info</h3>' +
        '<div>URL: ' + this.video.src + '</div>' +
      '<div>Size: ' + this.video.width + 'x' + this.video.height + ' (video : ' + this.video.videoWidth + 'x' + this.video.videoHeight + ')</div>' +
        '<div>Progress: ' + Math.round(this.video.currentTime) + '/' + this.video.duration + 's</div>' +
        '<div>Volume: ' + this.video.volume + '</div>' +
        '<div>Status: ' + this.status + '</div>' +
        '<div>'
      '</div>';

      this.mainContainer.innerHTML = tmpl
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
