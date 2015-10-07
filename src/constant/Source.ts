/// <reference path="../model/ISourceData.ts" />
 
namespace videomock.constant {
  export class Source {
    static VIDEO_640x360_30S: string = '640x360-30'

    static getDataFromSource(src: string): model.ISourceData {
      var exploded = src.split('-')
      var size = exploded[0].split('x')
      if (!size[1]) {
        throw 'invalid source, use default'
      }

      return <model.ISourceData>{
        'width': Number(size[0]),
        'height': Number(size[1]),
        'duration': Number(exploded[1])
      }
    }
  }
}