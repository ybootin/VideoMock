namespace videomock.constant {
  export class Preload {
    static NONE: string = 'none'
    static METADATA: string = 'metadata'
    static AUTO: string = 'auto'
    static EMPTY: string = ''

    static DEFAULT: string = (function(): string {
      return /Firefox/.test(window.navigator.userAgent) ? Preload.EMPTY : Preload.AUTO
    })()
  }
}
