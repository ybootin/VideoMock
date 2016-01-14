namespace videomock.constant {
  export enum LoadStatus {
    'UNSTARTED'= 0,
    'METADATA' = 1, // mean loading have been paused
    'LOADEDDATA' = 2,
    'LOADING' = 3, // load progress
    'LOADED' = 4, // load ended
  }
}
