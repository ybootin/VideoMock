/// <reference path="MediaElement.ts" />

namespace videomock.dom {
  /**
   * Abstract HTMLVideoElement implementation.
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
   * based on typescript interface : 
   *   https://github.com/Microsoft/TypeScript/blob/master/lib/lib.dom.d.ts
   */
  export class VideoElement extends MediaElement {
    protected _poster: string;
    protected _videoHeight: number = 0;
    protected _videoWidth: number = 0;

    static implement(classObject: Function): void {
      // super implementation
      MediaElement.implement(classObject)

      var properties = {
        'poster': [true, true],
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

    public webkitExitFullScreen (): void {
      this.webkitExitFullscreen()
    }

    public webkitExitFullscreen(): void {
      throw 'not implemented'
    }
  }
}
