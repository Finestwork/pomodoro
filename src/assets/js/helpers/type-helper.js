export default class TypeHelper {
  static isNumber(num) {
    return (
      (typeof num === 'number' || Object.prototype.toString.call(num)) && num !== '' && !isNaN(num)
    );
  }

  static isFloat(num) {
    const FLOAT = parseFloat(num);
    return TypeHelper.isNumber(FLOAT) && !Number.isInteger(FLOAT);
  }

  static isInteger(num) {
    const FLOAT = parseFloat(num);
    return TypeHelper.isNumber(FLOAT) && Number.isInteger(FLOAT);
  }
}
