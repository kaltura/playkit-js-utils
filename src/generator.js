// @flow
const _Generator = {
  /**
   * Generates unique id.
   * @param {number} length - The length of the id.
   * @returns {string} - The generated id.
   */
  uniqueId: function(length: ?number) {
    let from = 2;
    let to = from + (!length || length < 0 ? 0 : length - 2);
    return (
      '_' +
      Math.random()
        .toString(36)
        .substr(from, to)
    );
  },

  /**
   * Generates GUID.
   * @return {string} - GUID
   * @private
   */
  guid: function(): string {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  }
};

export {_Generator as Generator};
