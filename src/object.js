// @flow
const _Object = {
  /**
   * @param {Array<Object>} objects - The objects to merge
   * @returns {Object} - The merged object.
   */
  merge: function(objects: Array<Object>): Object {
    let target = {};
    for (let obj of objects) {
      Object.assign(target, obj);
    }
    return target;
  },

  /**
   * @param {any} item - The item to check.
   * @returns {boolean} - Whether the item is an object.
   */
  isObject: function(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  },

  /**
   * @param {any} target - The target object.
   * @param {any} sources - The objects to merge.
   * @returns {Object} - The merged object.
   */
  mergeDeep: function(target: any, ...sources: any): Object {
    if (!sources.length) {
      return target;
    }
    const source = sources.shift();
    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, {[key]: {}});
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, {[key]: source[key]});
        }
      }
    }
    return this.mergeDeep(target, ...sources);
  },

  /**
   * @param {any} data - The data to copy.
   * @returns {any} - The copied data.
   */
  copyDeep: function(data: any): any {
    let node;
    if (Array.isArray(data)) {
      node = data.length > 0 ? data.slice(0) : [];
      node.forEach((e, i) => {
        if ((typeof e === 'object' && e !== {}) || (Array.isArray(e) && e.length > 0)) {
          node[i] = this.copyDeep(e);
        }
      });
    } else if (data !== null && typeof data === 'object') {
      if (data.clone && typeof data.clone === 'function') {
        node = data.clone();
      } else {
        node = Object.assign({__proto__: data.__proto__}, data);
        Object.keys(node).forEach(key => {
          if (
            (typeof node[key] === 'object' && node[key] !== {}) ||
            (Array.isArray(node[key]) && node[key].length > 0)
          ) {
            node[key] = this.copyDeep(node[key]);
          }
        });
      }
    } else {
      node = data;
    }
    return node;
  },

  /**
   * Checks if an object is an empy object.
   * @param {Object} obj - The object to check
   * @returns {boolean} - Whether the object is empty.
   */
  isEmptyObject: function(obj: Object): boolean {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  },

  /**
   * Checks for nested object properties.
   * @param {Object} obj - The object to check.
   * @param {string} propertyPath - The path to check.
   * @returns {boolean} - The value in this path.
   */
  getPropertyPath: function(obj: Object, propertyPath: string): any {
    return propertyPath.split('.').reduce(function(o, x) {
      return typeof o === 'undefined' || o === null ? o : o[x];
    }, obj);
  },

  /**
   * Checks for nested object properties.
   * @param {Object} obj - The object to check.
   * @param {string} propertyPath - The path to check.
   * @returns {boolean} - Whether the path exists in the object.
   */
  hasPropertyPath: function(obj: Object, propertyPath: string): boolean {
    if (!propertyPath) {
      return false;
    }
    let properties = propertyPath.split('.');
    for (let i = 0; i < properties.length; i++) {
      let prop = properties[i];
      if (!obj || !obj.hasOwnProperty(prop)) {
        return false;
      } else {
        obj = obj[prop];
      }
    }
    return true;
  },

  /**
   * Create an object with a given property path.
   * @param {Object} obj - The object to create on.
   * @param {string} path - The path to create in the object.
   * @param {any} value - The value to set in the path.
   * @returns {Object} - The result object.
   */
  createPropertyPath: function(obj: Object, path: string, value: any = null): Object {
    let pathArray = path.split('.');
    let current = obj;
    while (pathArray.length > 1) {
      const [head, ...tail] = pathArray;
      pathArray = tail;
      if (current[head] === undefined) {
        current[head] = {};
      }
      current = current[head];
    }
    current[pathArray[0]] = value;
    return obj;
  },

  /**
   * Deleted a property path from an object.
   * @param {Object} obj - The object to delete the property path from.
   * @param {string} path - The path to delete in the object.
   * @returns {void}
   */
  deletePropertyPath: function(obj: Object, path: string): void {
    if (!obj || !path) {
      return;
    }
    let pathArray = path.split('.');
    for (let i = 0; i < pathArray.length - 1; i++) {
      obj = obj[pathArray[i]];
      if (typeof obj === 'undefined') {
        return;
      }
    }
    delete obj[pathArray.pop()];
  },

  /**
   * Creates deferred promise which can resolved/rejected outside the promise scope.
   * @returns {DeferredPromise} - The promise with resolve and reject props.
   */
  defer: function(): DeferredPromise {
    let res, rej;
    // $FlowFixMe
    let promise = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    // $FlowFixMe
    promise.resolve = res;
    // $FlowFixMe
    promise.reject = rej;
    return promise;
  },

  /**
   * Binds an handler to a desired context.
   * @param {any} thisObj - The handler context.
   * @param {Function} fn - The handler.
   * @returns {Function} - The new bound function.
   * @public
   */
  bind: function(thisObj: any, fn: Function): Function {
    return function() {
      fn.apply(thisObj, arguments);
    };
  }
};

export {_Object as Object};
