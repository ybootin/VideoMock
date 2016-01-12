namespace videomock.helper {
  interface IPropertyObject {
    enumerable: boolean
    configurable: boolean
    get(): any
    set(value: any): void
  }

  export interface IObjectHelperProperties {
    [index: string]: IObjectHelperProperty
  }

  export interface IObjectHelperProperty {
    haveSetter: boolean
    defaultValue: any
    type?: string
  }

  export class ObjectHelper {
    /**
     * prototype all getter / setter
     *
     * @param {Function}                classObject [description]
     * @param {IObjectHelperProperties} properties  [description]
     */
    static genGettersSetters(classObject: Function, properties: IObjectHelperProperties): void {
      for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          helper.ObjectHelper.genGetterSetter(classObject, prop, true, properties[prop]['haveSetter'], true, true, properties[prop]['type'])
        }
      }
    }

    static genGetterSetter(classObject: Function, name: string, getter: boolean = true, setter: boolean = true, isEnumerable: boolean = true, isConfigurable: boolean = true, type?: string ): void {
      // this is dirty, but this is a simple way to get getter/setter of the private attributes
      // this way you override getter/setter without call Object.defineProperty again.
      // just override the setter `_get|set_name()`
      Object.defineProperty(classObject.prototype, name, (function(): IPropertyObject {
        // getter prototype
        classObject.prototype['_get_' + name] = function() {
          return this['_' + name]
        }

        var prop = {
          'enumerable': isEnumerable,
          'configurable': isConfigurable,
          'get': function (): any {
            return this['_get_' + name]()
          },
          set: function(value: any) {}
        }

        //define setter only if needed
        if (setter) {
          // setter prototype
          classObject.prototype['_set_' + name] = function(value) {
            var _this = this
            this['_' + name] = (function() {
              switch(type) {
                case 'number':
                case 'function':
                case 'string':
                  return typeof value === type ? value : _this['_' + name]
                case 'boolean': return !!value
                default: return value
              }
            })()
          }

          // setter implementation
          prop.set = function(value: any): void {
            this['_set_' + name](value)
          }
        }
        return prop
      })());
    }

    /**
     * Init object default properties values
     *
     * Should be called inside the constructor
     * @param {any}                     scope      [description]
     * @param {IObjectHelperProperties} attributes [description]
     */
    static initPropertiesValues(scope: any, properties: IObjectHelperProperties) {
      for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          scope['_' + prop] = properties[prop]['defaultValue']
        }
      }
    }

    /**
     * create an IObjectHelperProperty object, a shortcut to have a typing definiton quickly
     *
     * @param {boolean} haveSetter   [description]
     * @param {any}     defaultValue [description]
     * @param {string}  type         [description]
     */
    static createObjectProperty(haveSetter: boolean, defaultValue: any, type?: string): IObjectHelperProperty {
      return {
        'haveSetter': haveSetter,
        'defaultValue': defaultValue,
        'type': type,
      }
    }
  }
}
