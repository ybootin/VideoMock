namespace videomock.helper {
  export interface IPropertyObject {
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
      for (let prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          helper.ObjectHelper.genGetterSetter(classObject, prop, properties[prop]) // true, properties[prop]['haveSetter'], true, true, properties[prop]['type'])
        }
      }
    }

    static genGetterSetter(classObject: Function, name: string, property: IObjectHelperProperty): void { //name: string, getter: boolean = true, setter: boolean = true, isEnumerable: boolean = true, isConfigurable: boolean = true, type?: string): void {
      // this is dirty, but this is a simple way to get getter/setter of the private attributes
      // this way you override getter/setter without call Object.defineProperty again.
      // just override the setter `_get|set_name()`
      Object.defineProperty(classObject.prototype, name, (function(): IPropertyObject {
        // getter prototype
        classObject.prototype['_get_' + name] = function(): any {
          return typeof this['_' + name] === 'undefined' ? property.defaultValue : this['_' + name]
        }

        let prop: IPropertyObject = <IPropertyObject>{
          'enumerable': true,
          'configurable': true,
          'get': function (): any {
            return this['_get_' + name]()
          },
          set: function(value: any): void { return void(value) },
        }

        //define setter only if needed
        if (property.haveSetter) {
          // setter prototype
          classObject.prototype['_set_' + name] = function(value: any): void {
            this['_' + name] = (() => {
              let t: string = typeof value
              switch (property.type) {
                case 'number':
                  // Always try a cast to number, because all browsers accept this numberAttribute = '300'
                  value = ObjectHelper.toNumber(value)

                  // no setter allow NaN or negative value on mediaElement
                  if (typeof value === 'number' && !isNaN(value) && value >= 0) {
                    return value
                  } else {
                    // Chrome set default value when invalid number
                    // Firefox unchange value
                    return property.defaultValue
                  }
                case 'string':
                  if (t !== 'string') {
                    return String(value)
                  }
                  // do not break, string will act the same as bellow
                case 'function':
                  return t === property.type ? value : this[name]
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
    static initPropertiesValues(scope: any, properties: IObjectHelperProperties): void {
      for (let prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          /* tslint:disable:no-string-literal */
          scope['_' + prop] = properties[prop].defaultValue
          /* tslint:enable */
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

    static toNumber(value: any): any {
      if (typeof value === 'string' && /^[0-9]+$/.test(value)) {
        return parseInt(value, 10)
      } else {
        return value
      }
    }
  }
}
