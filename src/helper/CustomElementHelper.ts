/// <reference path="HTMLHelper.ts" />

namespace videomock.helper {
  export class CustomElementHelper {

    static observeStyle(customElement: HTMLVideoElement): MutationObserver {
      let observer: MutationObserver = new MutationObserver((mutations: Array<MutationRecord>) => {
        mutations.forEach((mutation: MutationRecord) => {
          if (mutation.attributeName === 'style') {
            let computed: CSSStyleDeclaration = HTMLHelper.getWindow(customElement).getComputedStyle(customElement)
            let width: number = Number(computed.getPropertyValue('width').replace('px', ''))
            let height: number = Number(computed.getPropertyValue('height').replace('px', ''))

            if (width !== customElement.width) {
              customElement.width = width
            }
            if (height !== customElement.height) {
              customElement.height = height
            }
          }
        })
      })

      observer.observe(customElement, <MutationObserverInit>{
        'attributes': true,
        'childList': true,
        'characterData': true,
      });

      return observer
    }

    static parseAttributes(customElement: HTMLElement): void {
      // DOM initialisation inline attributes
      let checkAttributes: Array<string> = [
        'width',
        'height',
        'src',
        'preload',
        'autoplay',
        'loop',
      ]

      checkAttributes.forEach((att: string): void => {
        if (customElement.hasAttribute(att)) {
          CustomElementHelper.updateAttribute(customElement, att)
        }
      })
    }

    static updateAttribute(customElement: HTMLElement, attributeName: string): void {
      let value: string = customElement.getAttribute(attributeName)

      switch (attributeName) {
        case 'width':
        case 'height':
          customElement[attributeName] = parseInt(value, 10)
          break
        case 'src':
        case 'preload':
          customElement[attributeName] = value
          break
        case 'autoplay':
        case 'loop':
          customElement[attributeName] = (function(): boolean {
            if (value === 'true') {
              return true
            } else if (value === 'false') {
              return false
            } else {
              return !!value
            }
          })()
          break
        default:
          // nothing
      }
    }
  }
}
