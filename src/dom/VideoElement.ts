/// <reference path="MediaElement.ts" />

namespace videomock.dom {
  /**
   * Abstract HTMLVideoElement implementation.
   *
   * @see http://dev.w3.org/html5/spec-preview/the-video-element.html#the-video-element
   *
   * Used to implement HTMLVideoElement on any HTMLElement
   *
   * USAGE :
   *    var Custom = Object.create(HTMLDivElement.prototype)
   *    Custom.createdCallback = function() {
   *      videomock.VideoElement.call(this)
   *    }
   *    videomock.VideoElement.implement(Custom)
   *
   *    var HTMLCustomElement = document.registerElement('video-mock', {
   *      prototype: Custom,
   *      extends: 'div'
   *    })
   *
   */
  export class VideoElement extends MediaElement {
    protected _poster: string;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _videoHeight: number = 0;
    protected _videoWidth: number = 0;

    // W3C specifications
    // @see http://dev.w3.org/html5/spec-preview/the-video-element.html#dom-video-videowidth
    static DEFAULT_VIDEOWIDTH: number = 300
    static DEFAULT_VIDEOHEIGHT: number = 150

    static implement(classObject: Function): void {
      // super implementation
      MediaElement.implement(classObject)

      var properties = {
        'poster': [true, true],
        'width': [true, true],
        'height': [true, true],
        'videoHeight': [true, false],
        'videoWidth': [true, false],
      }

      for (var prop in properties) {
        helper.ObjectHelper.genGetterSetter(classObject, prop, properties[prop][0], properties[prop][1])
      }

      classObject.prototype.getVideoPlaybackQuality = function(): VideoPlaybackQuality {
        return VideoElement.prototype.getVideoPlaybackQuality.call(this)
      }

      classObject.prototype.webkitEnterFullScreen = function(): void {
        VideoElement.prototype.webkitEnterFullScreen.call(this)
      }

      classObject.prototype.webkitEnterFullscreen = function(): void {
        VideoElement.prototype.webkitEnterFullscreen.call(this)
      }

      classObject.prototype.webkitExitFullScreen = function(): void {
        VideoElement.prototype.webkitExitFullScreen.call(this)
      }

      classObject.prototype.webkitExitFullscreen = function(): void {
        VideoElement.prototype.webkitExitFullscreen.call(this)
      }
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

    /**
     * exit the video fullscreen mode
     */
    public webkitEnterFullscreen(): void {
      throw 'not implemented'
    }

    public webkitExitFullScreen(): void {
      this.webkitExitFullscreen()
    }

    public webkitExitFullscreen(): void {
      throw 'not implemented'
    }
  }
}
