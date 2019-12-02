"use strict";

const Pg = require('pg')
const Util = require("../utils/util");

var client = new Pg.Client(process.env.POSTGRES);
var dbConnection = process.env.IS_LOCAL ? client : undefined;
var connection = dbConnection.connect();

class TokenModel {

  /**
   * Get a token string
   * @param {string} tokenString
   * @return {TokenModel|null}
   */
  static async getByTokenString(tokenString) {
    const items = await this._getByTokenString(tokenString);

    return items;
  }

  /**
   * Acquire a token with a token string。
   * @param {string} tokenString
   * @return {Object|null}
   */
  static async _getByTokenString(tokenString) {
    const query_str = `SELECT * FROM session_table WHERE token = '${tokenString}'`;
    const result = await dbConnection.query(query_str).catch(error => {
      throw error;
    });

    return result.rows;
  }

}

module.exports = TokenModel;
