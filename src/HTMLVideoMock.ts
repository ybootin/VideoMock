/// <reference path="VideoMock.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="helper/ObjectHelper.ts" />

interface Document {
  registerElement: any
}

namespace videomock {
  var custom = Object.create(HTMLDivElement.prototype)
  var setWidth = function(scope: HTMLElement, value: number): void {
     videomock.VideoMock.prototype._set_width.call(scope, scope.getAttribute('width'))
  }
  var setHeight = function(scope: HTMLElement, value: number): void {
     videomock.VideoMock.prototype._set_height.call(scope, scope.getAttribute('height'))
  }

  var updateWidthHeight = function(scope: HTMLElement) {
    var rect = scope.getBoundingClientRect()
    setWidth(scope, rect.width)
    setHeight(scope, rect.height)
  }

  custom.createdCallback = function() {
    // Constructor
    videomock.VideoMock.call(this)

    // Init UI
    var ui = new videomock.ui.VideoMockUI(this)
    this.appendChild(ui.getContainer())
  }

  custom.attachedCallback = function(): void {
    // define default size
    // var rect = this.getBoundingClientRect()

    // setWidth(this, rect.width || dom.VideoElement.DEFAULT_VIDEOWIDTH)
    // setHeight(this, rect.height || dom.VideoElement.DEFAULT_VIDEOHEIGHT)
  }

  custom.detachedCallback = function(): void {
    // ideally, should destroy UI
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

  VideoMock.implement(HTMLVideoMock)
}
