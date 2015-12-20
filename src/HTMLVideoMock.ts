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
    // Implement & Construct
    VideoMock.implement(HTMLVideoMock)
    VideoMock.call(this)

    // Init UI
    ui = new videomock.ui.VideoMockUI(this)
  }

  custom.attachedCallback = function(): void {
    // Use default size if unspecified
    if (!this.width) {
      this.width = dom.VideoElement.DEFAULT_VIDEOWIDTH
    }
    if (!this.height) {
      this.height = dom.VideoElement.DEFAULT_VIDEOHEIGHT
    }

    var checkAttributes = [
      'width',
      'height',
      'autoplay',
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
        this.width = Number(this.getAttribute('width'))
        break
      case 'height':
        this.height = Number(this.getAttribute('height'))
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
        this.autoplay = Boolean(this.getAttribute('autoplay'))
        break
    }
  }

  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: custom,
    extends: 'div'
  })

}
