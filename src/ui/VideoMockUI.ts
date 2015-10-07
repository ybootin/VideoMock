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
      video.addEventListener(event.MediaEvent.ended, () => this.updateDisplay())     
      video.addEventListener(event.MediaEvent.error, () => this.updateDisplay()) 
      video.addEventListener(event.MediaEvent.pause, () => this.updateDisplay())  
      video.addEventListener(event.MediaEvent.playing, () => this.updateDisplay())   
      video.addEventListener(event.MediaEvent.play, () => this.updateDisplay())  
      //video.addEventListener('resize', () => this.updateDisplay())  

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
      var tmpl = '<div style="background-color:#CCCCCC;position:absolute;top:' + (this.video.width - this.video.videoWidth) / 2 + 'px;left:' + (this.video.height - this.video.videoHeight) / 2 + 'px">' +
                  '<div>URL : ' + this.video.src + '</div>' +
                  '<div>Size : ' + this.video.width + 'x' + this.video.height + ' (video : ' + this.video.videoWidth + 'x' + this.video.videoHeight + ')</div>' +
                  '<div>Progress : ' + this.video.currentTime + '/' + this.video.duration + 's</div>' +
                  '<div>Status : ' + this.status + '</div>' +
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