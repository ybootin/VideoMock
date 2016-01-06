/**
 * ProgressEvent Polyfill for PhantomJS
 *
 * @param {[type]} window [description]
 */
(function(window) {
  // http://engineering.shapesecurity.com/2015/01/detecting-phantomjs-based-visitors.html
  if (/PhantomJS/.test(window.navigator.userAgent)) {
    interface IProgressEventInit {
      lengthComputable: boolean
      loaded: number
      total: number
    }

    var ProgressEvent = function(type: string, eventInit:IProgressEventInit): void {
      this.type = type
      this.lengthComputable = eventInit.lengthComputable
      this.loaded = eventInit.loaded
      this.total = eventInit.total
    }

    ProgressEvent.prototype = Object.create(Event.prototype)
    ProgressEvent.prototype.constructor = ProgressEvent

    window.ProgressEvent = ProgressEvent
  }
})(window)
