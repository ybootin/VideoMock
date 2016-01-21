interface IProgressEventInit {
  lengthComputable: boolean
  loaded: number
  total: number
}

interface Window {
  ProgressEvent(event: string, eventInit: IProgressEventInit): void
}

interface IProgressEventConstructor {
  (type: string, eventInit: IProgressEventInit): void
}

/**
 * ProgressEvent Polyfill for PhantomJS
 *
 * @param {[type]} window [description]
 */
(function(window: Window): any {
  // http://engineering.shapesecurity.com/2015/01/detecting-phantomjs-based-visitors.html
  if (/PhantomJS/.test(window.navigator.userAgent)) {

    let progressEventPolyfill: IProgressEventConstructor = function(type: string, eventInit: IProgressEventInit): void {
      this.type = type
      this.lengthComputable = eventInit.lengthComputable
      this.loaded = eventInit.loaded
      this.total = eventInit.total
    }

    progressEventPolyfill.prototype = Object.create(Event.prototype)
    progressEventPolyfill.prototype.constructor = progressEventPolyfill

    window.ProgressEvent = progressEventPolyfill
  }
})(window)
