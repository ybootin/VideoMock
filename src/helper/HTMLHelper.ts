namespace videomock.helper {
  export class HTMLHelper {
    static applyStyle(element: HTMLElement, style: any): void {
      for (let att in style) {
        if (element.style.hasOwnProperty(att)) {
          element.style[att] = style[att]
        }
      }
    }
  }
}
