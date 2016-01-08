/// <reference path="./model/ISourceData.ts" />

namespace videomock {
  /**
   * Provide an helper like to generate and parse src url
   * will gen an URL to define video properties
   */
  export class VideoMockURL {
    static DEFAULT: model.ISourceData = {
      'width': 640,
      'height': 360,
      'duration': 30,
      'fileSize': 3000, // 3Mb
      'bandwidth': 1000, // 1mb/sec
      'fps': 24, // 24 frames per seconds
    }

    static parse(src: string): model.ISourceData {
      var data: model.ISourceData
      try {
        data = JSON.parse(src) || {}
      } catch (e) {
        data = {}
      }

      for (var key in VideoMockURL.DEFAULT) {
        if (!data[key]) {
          data[key] = VideoMockURL.DEFAULT[key]
        }
      }

      return data
    }

    static gen(data: model.ISourceData): string {
      return JSON.stringify(data)
    }
  }
}
