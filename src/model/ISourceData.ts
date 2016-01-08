namespace videomock.model {
  export interface ISourceData {
    width?: number
    height?: number
    duration?: number
    /**
     * the file size in Ko
     */
    fileSize?: number

    /**
     * The available bandwidth in Ko
     */
    bandwidth?: number

    /**
     * Frame rate in seconds
     */
    fps?: number
  }
}
