/// <reference path="HTMLMediaElement.ts" />

namespace videomock.dom {
  export class HTMLVideoElement extends HTMLMediaElement {
    protected _width: number;
    protected _height: number;
    protected _poster: string;
    protected _videoHeight: number;
    protected _videoWidth: number;

    /**
     * Gets or sets the width of the video element.
     */
    get width(): number {
      return this._width
    }

    set width(value: number) {
      this._width = value 
    }

    /**
     * Gets or sets the height of the video element.
     */
    get height(): number {
      return this._height
    }

    set height(value: number) {
      this._height = value 
    }

    /**
     * Gets the intrinsic height of a video in CSS pixels, or zero if the dimensions are not known.
     */
    get videoHeight(): number {
      return this._videoHeight
    }

    /**
     * Gets the intrinsic width of a video in CSS pixels, or zero if the dimensions are not known.
     */
    get videoWidth(): number {
      return this._videoWidth
    }

    /**
     * Gets or sets a URL of an image to display, for example, like a movie poster. This can be a still frame from the video, or another image if no video data is available.
     */
    get poster(): string {
      return this._poster
    }

    set poster(value: string) {
      this._poster = value
    }

    /**
     * The HTMLVideoElement.getVideoPlaybackQuality() creates and returns a VideoPlaybackQuality object containing metrics about the current quality of the video restitution.
     */
    public getVideoPlaybackQuality(): VideoPlaybackQuality {
      throw 'not implemented'
    }

    /**
     * activate the video fullscreen mode
     */
    public webkitEnterFullScreen(): void {
      this.webkitEnterFullscreen()
    }

    public webkitEnterFullscreen(): void {
      throw 'not implemented'
    }

    /**
     * exit the video fullscreen mode
     */
    public webkitExitFullScreen(): void {
      this.webkitExitFullscreen()
    }

    public webkitExitFullscreen(): void {
      throw 'not implemented'
    }

  }
}
