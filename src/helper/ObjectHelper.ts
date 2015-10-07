namespace videomock.helper {
  export class ObjectHelper {
    static extend (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    static genGetterSetter(classObject: Function, name: string, getter: boolean = true, setter: boolean = true, isEnumerable: boolean = true, isConfigurable: boolean = true): void {
      if (getter && setter) {
        Object.defineProperty(classObject.prototype, name, {
          get: function () {
              return this['_' + name];
          },
          set: function (value) {
              this['_' + name] = value;
          },
          enumerable: isEnumerable,
          configurable: isConfigurable
        });
      } else if (getter) {
        ObjectHelper.genGetter(classObject, name, isEnumerable, isConfigurable)
      } else if (setter) {
         ObjectHelper.genSetter(classObject, name, isEnumerable, isConfigurable)
      }
    }

    static genGetter(classObject: Function, name: string, isEnumerable: boolean = true, isConfigurable: boolean = true): void {
      Object.defineProperty(classObject.prototype, name, {
        get: function () {
            return this['_' + name];
        },
        enumerable: isEnumerable,
        configurable: isConfigurable
      });
    }

    static genSetter(classObject: Function, name: string, isEnumerable: boolean = true, isConfigurable: boolean = true): void {
      Object.defineProperty(classObject.prototype, name, {
        set: function (value) {
            this['_' + name] = value;
        },
        enumerable: isEnumerable,
        configurable: isConfigurable
      });
    }
  }
}