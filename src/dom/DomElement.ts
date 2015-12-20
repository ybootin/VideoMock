/// <reference path="../event/EventHandler.ts" />
/// <reference path="../event/MediaEvent.ts" />

namespace videomock.dom {
  /**
   * Abstract Dom Element
   */
  export abstract class DomElement {

    protected _eventHandler: event.EventHandler = new event.EventHandler();

    protected _handledEvents: Array<string>;

    static implement(classObject: Function): void {
      // overriden prototype methods
      var methods = [
        'addEventListener',
        '_dispatchEvent',
        '_handleEvent',
        '_getHandledEvents',
      ]

      methods.forEach((item): void => {
        classObject.prototype[item] = DomElement.prototype[item]
      })
    }

    /**
     * Override addEventListener to handle dedicated media event.
     */
    public addEventListener(type: string, listener: EventListener, useCapture: boolean = false): void {
      var handled = this._getHandledEvents()
      if (handled && handled.indexOf(type) > -1) {
        this._eventHandler.addEventListener(type, listener, useCapture)
      } else {
        // Super call
        HTMLElement.prototype.addEventListener.apply(this, arguments)
      }
    }

    public _dispatchEvent(eventName: string, eventData?: any): void {
      this._handleEvent(new CustomEvent(eventName, eventData))
    }

    public _handleEvent(evt: Event): void {
      this._eventHandler.handleEvent(evt)
    }

    public _getHandledEvents(): Array<string> {
      // avoid loop on mediaEvent each time
      if (!this._handledEvents) {
        this._handledEvents = []
        for (var evt in event.MediaEvent) {
          this._handledEvents.push(event.MediaEvent[evt])
        }
      }
      return this._handledEvents
    }
  }
}
