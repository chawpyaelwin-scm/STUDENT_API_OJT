const Util = require("../utils/util");
const CustomErrors = require("../utils/customErrors");
const CustomError = CustomErrors.CustomError;

class AbstractModel {

  /**
   *
   * @param {CustomError|Error} error
   * @param {string} message
   * @param {number} statusCode
   * @param {Array.<Object>} errors
   * @throws {CustomError} CustomError
   */
  static throwCustomError(error, message, statusCode = 500, errors) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      console.log(error);
      throw new CustomError(message, statusCode, errors);
    }
  }
}

module.exports = AbstractModel;
