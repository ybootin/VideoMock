/// <reference path="VideoMock.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="helper/ObjectHelper.ts" />

interface Document {
  registerElement: any
}

namespace videomock {
  var CustomImpl = function() {
    VideoMock.call(this)

    this._ui = new videomock.ui.VideoMockUI(this)
  }

  CustomImpl.prototype = VideoMock.prototype

  // Webcomponents callbacks
  CustomImpl.prototype.createdCallback = function() {
    // Construct, super call
    CustomImpl.call(this)
  }

  CustomImpl.prototype.attachedCallback = function(): void {
    // DOM initialisation inline attributes
    var checkAttributes = [
      'style',
      'width',
      'height',
      'src',
      'preload',
      'autoplay',
      'loop',
    ]

    checkAttributes.forEach((att: string): void => {
      if (this.hasAttribute(att)) {
        this.attributeChangedCallback(att)
      } else {
        switch (att) {
          case 'width':
            this.width = constant.Common.DEFAULT_VIDEOWIDTH
            break
          case 'height':
            this.height = constant.Common.DEFAULT_VIDEOHEIGHT
            break
        }
      }
    })

    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          this.attributeChangedCallback('style')
        }
      })
    })

    var config = { attributes: true, childList: true, characterData: true };

    observer.observe(this, config);

    if (typeof this.createShadowRoot === 'function') {
      var shadow = this.createShadowRoot()
      shadow.appendChild(this._ui.getContainer())
    } else {
      this.appendChild(this._ui.getContainer())
    }

  }

  CustomImpl.prototype.detachedCallback = function(): void {
    var cnt = this._ui.getContainer()
    if (this.contains(cnt)) {
      this.removeChild(cnt)
    }
  }


  CustomImpl.prototype.attributeChangedCallback = function(attributeName: string): void {
    var value = this.getAttribute(attributeName)

    switch (attributeName) {
      case 'width':
      case 'height':
        this[attributeName] = parseInt(value)
        break
      case 'style':
        let computed = window.getComputedStyle(this)
        let width: number = Number(computed.getPropertyValue('width').replace('px', ''))
        let height: number = Number(computed.getPropertyValue('height').replace('px', ''))

        if (width !== this.width) {
          this.width = width
        }
        if (height !== this.height) {
          this.height = height
        }
        break
      case 'src':
      case 'preload':
        this.src = this.getAttribute('src')
        break
      case 'autoplay':
      case 'loop':
        this[attributeName] = (function() {
          if (value === 'true') {
            return true
          } else if (value === 'false') {
            return false
          } else {
            return value
          }
        })()
        break
    }

    this._ui.updateDisplay()
  }

  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: CustomImpl.prototype,
  })

  // Must redefine HTMLElement overrided prototype, because document.registerElement will re-override them !
  HTMLVideoMock.prototype.addEventListener = VideoMock.prototype.addEventListener
}
