/// <reference path="VideoMock.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="helper/ObjectHelper.ts" />

interface Document {
  registerElement: any
}

namespace videomock {
  var custom = Object.create(HTMLDivElement.prototype)

  var ui: videomock.ui.VideoMockUI

  custom.createdCallback = function() {
    // Construct, super call
    VideoMock.call(this)

    // Init UI
    ui = new videomock.ui.VideoMockUI(this)
  }

  custom.attachedCallback = function(): void {
    // Use default size if unspecified
    if (!this.width) {
      this.width = constant.Common.DEFAULT_VIDEOWIDTH
    }
    if (!this.height) {
    this.height = constant.Common.DEFAULT_VIDEOHEIGHT
    }

    // List of attributes that can be chnage in DOM
    var checkAttributes = [
      'width',
      'height',
      'autoplay',
      'loop',
      'preload',
      'src',
      'style',
    ]

    checkAttributes.forEach((att: string): void => {
      if (!!this.getAttribute(att)) {
        this.attributeChangedCallback(att)
      }
    })

    this.appendChild(ui.getContainer())
  }

  custom.detachedCallback = function(): void {
    this.removeChild(ui.getContainer())
  }

  custom.attributeChangedCallback = function(attributeName: string): void {
    switch (attributeName) {
      case 'width':
      case 'height':
        this[attributeName] = Number(this.getAttribute(attributeName))
        break
      case 'style':
        var rect = this.getBoundingClientRect()
        this.width = rect.width
        this.height = rect.height
        break
      case 'src':
        this.src = this.getAttribute('src')
        break
      case 'autoplay':
      case 'preload':
      case 'loop':
        this[attributeName] = Boolean(this.getAttribute(attributeName))
        break
    }
  }

  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: custom,
    extends: 'div'
  })

  // Implements
  VideoMock.implement(HTMLVideoMock)

}
