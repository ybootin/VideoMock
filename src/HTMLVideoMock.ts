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
      //if (this.hasAttribute(att)) {
        this.attributeChangedCallback(att)
      //}
    })

    // dirty fix
     setInterval(() =>  {
       if (!this.style) {
         return
       }
       var parseStyle = function(styleAtt) {
         if (styleAtt && styleAtt.indexOf('px')) {
           return Number(styleAtt.replace('px', ''))
         }
       }
       var width = parseStyle(this.style.width)
       var height = parseStyle(this.style.height)
       if (width) {
         this.width = width
       }
       if (height) {
         this.height = height
       }
     }, 10)

    this.appendChild(ui.getContainer())
  }

  custom.detachedCallback = function(): void {
    this.removeChild(ui.getContainer())
  }

  custom.attributeChangedCallback = function(attributeName: string): void {
    if (!this.hasAttribute(attributeName)) {
      return
    }
    var value = this.getAttribute(attributeName)
    switch (attributeName) {
      case 'width':
      case 'height':
      this[attributeName] = Number(value)
        break
      case 'style':
        var parseStyle = function(styleAtt) {
          if (styleAtt && styleAtt.indexOf('px')) {
            return Number(styleAtt.replace('px', ''))
          }
        }
        this.width = parseStyle(this.style.width)
        this.height = parseStyle(this.style.height)
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
  }

  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: custom,
    extends: 'div'
  })

  // Implements
  VideoMock.implement(HTMLVideoMock)

}
