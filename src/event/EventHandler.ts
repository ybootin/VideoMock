
namespace videomock.event {
  /**
   * a simple event handler implementation
   */
  export class EventHandler {
    /**
     * Holds the vpaid events callback
     */
    private listeners: {[index: string]: EventListener[]}  = {}

    public addEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
      this.listeners[type] = this.listeners[type]  || []
      this.listeners[type].push(listener)
    }

    public removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
      var index = this.listeners[type].indexOf(listener)
      if (index >= 0) {
        // reset callback
        listener[index] = function(): void {}
      }
    }

    public clearListeners(): void {
      this.listeners = {}
    }

    public handleEvent(evt: Event): void {
      try {
        var listeners: Array<EventListener> = this.listeners[evt.type] || []
      } catch(e) {
        console.log('handleEvent failled', evt)
        return
      }
      // exec listeners per event
      for (var i = 0, l = listeners.length; i < l ; i++) {
        try {
          listeners[i](evt)
        }
        catch (err) {
          // to be implemented !!!
        }
      }
    }
  }
}
