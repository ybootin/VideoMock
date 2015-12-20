/// <reference path="VideoMock.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="helper/ObjectHelper.ts" />

interface Document {
  registerElement: any
}

namespace videomock {
  var custom = Object.create(HTMLDivElement.prototype)

  var updateWidthHeight = function(scope: HTMLVideoElement) {
    var rect = scope.getBoundingClientRect()
    scope.width = rect.width
    scope.height = rect.height
  }

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

    this.appendChild(ui.getContainer())
  }

  custom.detachedCallback = function(): void {
    this.removeChild(ui.getContainer())
  }

  custom.attributeChangedCallback = function(attributeName: string): void {
    switch (attributeName) {
      case 'width':
      case 'height':
      case 'style':
        updateWidthHeight(this)
        break
    }
  }

  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: custom,
    extends: 'div'
  })

}
