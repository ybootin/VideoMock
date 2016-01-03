/// <reference path="VideoMock.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="helper/ObjectHelper.ts" />
/// <reference path="model/Document.ts" />

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

    this.appendChild(this._ui.getContainer())
  }

  CustomImpl.prototype.detachedCallback = function(): void {
    this.removeChild(this._ui.getContainer())
  }


  CustomImpl.prototype.attributeChangedCallback = function(attributeName: string): void {
    var value = this.getAttribute(attributeName)

    switch (attributeName) {
      case 'width':
      case 'height':
        this[attributeName] = Number(value)
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
        this.src = this.getAttribute('src')
        break
      case 'autoplay':
      case 'preload':
      case 'loop':
        this[attributeName] = Boolean(value)
        break
    }

    this._ui.updateDisplay()
  }

  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: CustomImpl.prototype,
    extends: 'div'
  })

  // Must redefine HTMLElement overrided prototype, because document.registerElement will re-override them !
  HTMLVideoMock.prototype.addEventListener = VideoMock.prototype.addEventListener
}
