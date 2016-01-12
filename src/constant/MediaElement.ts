namespace videomock.constant {
  export class MediaElement {
    static HAVE_NOTHING: number = 0  // - no information whether or not the audio/video is ready
    static HAVE_METADATA: number = 1  // - metadata for the audio/video is ready
    static HAVE_CURRENT_DATA: number = 2  // - data for the current playback position is available, but not enough data to play next frame/millisecond
    static HAVE_FUTURE_DATA: number = 3  // - data for the current and at least the next frame is available
    static HAVE_ENOUGH_DATA: number = 4  // - enough data available to start playing

    static NETWORK_EMPTY: number = 0
    static NETWORK_IDLE: number = 1
    static NETWORK_LOADING: number = 2
    static NETWORK_NO_SOURCE: number = 3
  }
}
