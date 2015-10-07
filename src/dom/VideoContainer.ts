/// <reference path="../helper/HTMLHelper.ts" />

namespace videomock.dom {
  export class VideoContainer {
    private mainContainer: HTMLDivElement
    private videoContainer: HTMLDivElement;
    private countdownContainer: HTMLDivElement;

    private _width: number;
    private _height: number;

    private _videoWidth: number;
    private _videoHeight: number; 

    private currentTime: number;

    constructor() {
      // main container 
      this.mainContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLHelper.applyStyle(this.mainContainer, {
        'position': 'relative',
        'backgroundColor': '#000000',
      })

      // video container
      this.videoContainer = <HTMLDivElement>document.createElement('div')  
      helper.HTMLHelper.applyStyle(this.videoContainer, {
        'position': 'absolute',
        'backgroundColor': '#CCCCCC',
        'top': '0',
        'left': '0',
      })

      this.mainContainer.appendChild(this.videoContainer)

      // Countdow container
      this.countdownContainer = <HTMLDivElement>document.createElement('div')
      helper.HTMLHelper.applyStyle(this.countdownContainer, {
        'textAlign': 'center',
        'color': '#FFFFFF',
        'marginTop': (this.height - this.countdownContainer.offsetHeight) / 2
      })

      this.mainContainer.appendChild(this.videoContainer)
    }

    public getContainer(): HTMLDivElement {
      return this.mainContainer
    }

    get width(): number {
      return this._width
    }

    set width(value: number) {
      this._width = value
      this.updateDisplay()
    }

    get height(): number {
      return this._height
    }

    set height(value: number) {
      this._height = value
      this.updateDisplay()
    }

    get videoWidth(): number {
      return this._videoWidth
    }

    set videoWidth(value: number) {
      this._videoWidth = value
      this.updateDisplay()
    }

    get videoHeight(): number {
      return this._videoHeight
    }

    set videoHeight(value: number) {
      this._videoHeight = value
      this.updateDisplay()
    }

    public setCurrentTime(time: number) {
      this.currentTime = time
      this.updateDisplay()
    }

    public updateDisplay(): void {
      helper.HTMLHelper.applyStyle(this.mainContainer, {
        'width': this.width + 'px',
        'height': this.height + 'px'
      })

      // calculate ratio
      if (this.videoWidth > this.width || this.videoHeight > this.height) {
        // @TODO
      }

      helper.HTMLHelper.applyStyle(this.videoContainer, {
        'width': this.videoWidth + 'px',
        'height': this.videoHeight + 'px',
        'overflow': 'hidden',
        'top' : (this.width - this.videoWidth) / 2,
        'left': (this.height - this.videoHeight) / 2
      })  

      this.countdownContainer.innerHTML = String(this.currentTime)
    }
  }
}