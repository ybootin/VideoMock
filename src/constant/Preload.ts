namespace videomock.constant {
  export class Preload {
    static VALUES: Array<string> = ['', 'auto', 'metadata', 'none']

    static NONE: string = 'none'
    static METADATA: string = 'metadata'
    static AUTO: string = 'auto'
    static EMPTY: string = ''

    // same behvior as chrome & safari
    static DEFAULT: string =  Preload.AUTO
  }
}
