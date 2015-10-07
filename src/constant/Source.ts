/// <reference path="../model/ISourceData.ts" />
 
namespace videomock.constant {
  export class Source {
    static VIDEO_640x360_30S: string = '640x360-30s'

    static getDataFromSource(id: string): model.ISourceData {
      var constName: string 
      for (var str in Source) {
        if (typeof Source[str] === 'string') {
          constName = str
        }
      }

      if (!constName) {
        throw 'data with id ' + id + ' doesn\'t exists'
      }

      var exploded = str.split('-')
      var size = exploded[0].split('x')

      return <model.ISourceData>{
        'width': size[0],
        'height': size[1],
        'duration': exploded[1]
      }
    }
  }
}