namespace videomock.dom {
  export var HTMLDivElement = document.registerElement('videomock', {
    prototype: Object.create(HTMLDivElement.prototype),
    extends: 'div'
  });
}