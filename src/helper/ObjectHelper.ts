namespace videomock.helper {
  export class ObjectHelper {
    static extend (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    static genGetterSetter(classObject: Function, name: string, getter: boolean = true, setter: boolean = true, isEnumerable: boolean = true, isConfigurable: boolean = true): void {
      // this is dirty, but this is a simple way to get getter/setter of the private attributes
      // this way you override getter/setter without call Object.defineProperty again.
      // just override the setter `_get|set_name()`
      classObject.prototype['_get_' + name] = function() {
        return getter ? this['_' + name] : undefined
      }
      classObject.prototype['_set_' + name] = function(value) {
        if (setter) {
          this['_' + name] = value
        }
        // FIXME , see if we should throw an execption or not whencall readonly setter
      }

      Object.defineProperty(classObject.prototype, name, {
        get: function () {
            return this['_get_' + name]()
        },
        set: function (value) {
          this['_set_' + name](value)
        },
        enumerable: isEnumerable,
        configurable: isConfigurable
      });
    }
  }
}
