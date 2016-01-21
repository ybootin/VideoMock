
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
      let index: number = this.listeners[type].indexOf(listener)
      if (index >= 0) {
        // reset callback
        this.listeners[type][index] = () => void(0)
      }
    }

    public clearListeners(): void {
      this.listeners = {}
    }

    public handleEvent(evt: Event): void {
      if (!this.listeners[evt.type] || !this.listeners[evt.type].length) {
        return
      }

      // exec listeners per event
      for (let i: number = 0, l: number = this.listeners[evt.type].length; i < l ; i++) {
        // Try/catch must be inside the loop, to avoid callback crashing and fail the others
        try {
          this.listeners[evt.type][i](evt)
        }
        catch (err) {
          // to be implemented !!!
        }
      }
    }
  }
}
