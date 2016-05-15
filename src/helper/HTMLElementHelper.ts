
namespace videomock.helper {
  export class HTMLElementHelper {
    static applyStyle(element: HTMLElement, style: any): void {
      for (let att in style) {
        if (element.style.hasOwnProperty(att)) {
          element.style[att] = style[att]
        }
      }
    }

    static getWindow(element: HTMLElement): Window {
      // Use type any to avoid define interface Document {parentWindow: window}, and avoid duplicate error
      let doc: any = <any>HTMLElementHelper.getDocument(element)
      return doc.defaultView || doc.parentWindow
    }

    static getDocument(element: HTMLElement): Document {
      return element.ownerDocument
    }
  }
}
