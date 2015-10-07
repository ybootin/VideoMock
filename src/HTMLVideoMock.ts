/// <reference path="VideoMock.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="helper/ObjectHelper.ts" />

interface Document {
  registerElement: any
}

namespace videomock {
  var custom = Object.create(HTMLDivElement.prototype)
  custom.createdCallback = function() {
    videomock.VideoMock.call(this)

    // Init UI
    var ui = new videomock.ui.VideoMockUI(this)
    this.appendChild(ui.getContainer())
  }
  
  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: custom,
    extends: 'div'
  })

  VideoMock.implement(HTMLVideoMock)
}