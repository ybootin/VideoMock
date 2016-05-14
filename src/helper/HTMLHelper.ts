interface Document {
  parentWindow: Window
}

namespace videomock.helper {
  export class HTMLHelper {
    static applyStyle(element: HTMLElement, style: any): void {
      for (let att in style) {
        if (element.style.hasOwnProperty(att)) {
          element.style[att] = style[att]
        }
      }
    }

    static getWindow(element: HTMLElement): Window {
      let doc: Document = HTMLHelper.getDocument(element)
      return doc.defaultView || doc.parentWindow
    }

    static getDocument(element: HTMLElement): Document {
      return element.ownerDocument
    }
  }
}
