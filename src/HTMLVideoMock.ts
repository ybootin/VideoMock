/// <reference path="VideoMock.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="helper/ObjectHelper.ts" />

interface Document {
  registerElement: any
}

namespace videomock {
  var custom = Object.create(HTMLDivElement.prototype)
  custom.createdCallback = function() {
    // Constructor
    videomock.VideoMock.call(this)

    // define default dimensions
    this.width = this._get_width()
    this.height = this._get_height()
    
    // Init UI
    var ui = new videomock.ui.VideoMockUI(this)
    this.appendChild(ui.getContainer())

    // var onAttributeChange = function(id, oldval, newval) {
    //   console.log('property ' + id + ' change', oldval, newval)
    //   setTimeout(function() {
    //     ui.updateDisplay()
    //   })
    // }

    // // add a watch to update display 
    // this.watch('width', onAttributeChange)
    // this.watch('height', onAttributeChange)
    // this.watch('volume', onAttributeChange)
    // this.style.watch('width', onAttributeChange)
    // this.style.watch('height', onAttributeChange)
  }
  
  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: custom,
    extends: 'div'
  })

  VideoMock.implement(HTMLVideoMock)
}