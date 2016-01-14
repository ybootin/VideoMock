/// <reference path="ISourceData.ts" />

namespace videomock.model {
  export interface IVideoMock extends HTMLVideoElement {
    new (): HTMLVideoElement
    (): void

    // Static
    PLAYBACK_TIMER_RATE: number
    PROGRESS_TIMER_RATE: number
    // The buffer size for HAVE_ENOUGHT_DATA
    BUFFERSIZE: number

    METADATASIZE: number

    // Properties
    _readyState: number
    _sourceData: model.ISourceData
    _bytesLoaded: number
    _bytesTotal: number
  }
}
