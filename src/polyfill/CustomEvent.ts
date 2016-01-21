interface Window {
  CustomEvent(event: string, params: any): CustomEvent
}

if (!window.CustomEvent) {
  (function(window: Window): void {
    function CustomEvent(event: string, params: any): CustomEvent {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined,
      }

      let evt: CustomEvent = <CustomEvent>document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = Event.prototype;

    window.CustomEvent = CustomEvent
  })(window)
}
