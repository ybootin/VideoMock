/// <reference path="VideoMock.ts" />
/// <reference path="ui/VideoMockUI.ts" />
/// <reference path="helper/ObjectHelper.ts" />
/// <reference path="helper/CustomElementHelper.ts" />

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

    helper.CustomElementHelper.observeStyle(this)
  }

  CustomImpl.prototype.attachedCallback = function(): void {
    // DOM initialisation inline attributes
    helper.CustomElementHelper.parseAttributes(this)

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
    helper.CustomElementHelper.updateAttribute(this, attributeName)

    this._ui.updateDisplay()
  }

  export var HTMLVideoMock = document.registerElement('video-mock', {
    prototype: CustomImpl.prototype
  })

  // Must redefine HTMLElement overrided prototype, because document.registerElement will re-override them !
  HTMLVideoMock.prototype.addEventListener = VideoMock.prototype.addEventListener
}
