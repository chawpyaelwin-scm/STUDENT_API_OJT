"use strict";

const Crypto = require("crypto");
const Moment = require("moment");
const Pg = require('pg');
const AbstractModel = require('./abstract');
const Util = require("../utils/util");
const CustomErrors = require("../utils/customErrors");
const CustomError = CustomErrors.CustomError;

var client = new Pg.Client(process.env.POSTGRES);
var dbConnection = process.env.IS_LOCAL ? client : undefined;
var connection = dbConnection.connect();

class UserModel extends AbstractModel {

  constructor(params = {}) {
    super();
    this.user_id = params.user_id;
    this.email = params.email;
    this.password = params.password;
    this.authStatus = params.authStatus;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

   /**
   * user create
   * @param {Object} params
   * @return {UserModel}
   */
  static async create(params) {
    // Confirm no duplicate email address
    const existingUser = await this.getByEmail(params.email).catch(error => {
      super.throwCustomError(error, "Failed to check existing user。");
    });

    if (existingUser.length > 0) {
      throw new CustomError("This email address is already in use。", 409);
    }

    const itemParams = {
      email:params.email,
      password:this.hashPassword(params.password),
      status: this.authStatus.verified, //Temporarily turn off mail authentication.
      created_at: Moment().format(),
      updated_at: Moment().format()
    };
    console.log("items________________",itemParams);

    const query_str = `INSERT INTO users(email, password, status, created_at, updated_at) VALUES('${itemParams.email}', '${itemParams.password}', '${itemParams.status}', '${itemParams.created_at}', '${itemParams.updated_at}')`;
    console.log("two----line",query_str);

    await dbConnection.query(query_str).catch(error => {
      throw error;
    });

    return this.toModel(itemParams);
  }

  /*************************************************************
   *static method
   *************************************************************/

  /**
   *
   * @param {Integer} id
   */
  static async saveLoginedId(user_id, email, token) {
    const query_str = `INSERT INTO session_table(user_id, email, token) VALUES('${user_id}', '${email}', '${token}')`;
    await dbConnection.query(query_str).catch(error => {
      throw error;
    });
  }

  /**
   *
   * @param {integer} logined_id
   * @returns {Object}
   */
  static async getLoginedId(logined_id) {

    const query_str = `SELECT * FROM session_table WHERE user_id = '${logined_id}'`;
    const result = await dbConnection.query(query_str).catch(error => {
      throw error;
    });

    return result.rows;
  }

  /**
   *
   * @param {integer} logined_id
   * @returns {object}
   */
  static async deleteLoginedId(logined_id) {
    const query_str = `DELETE FROM session_table WHERE user_id = '${logined_id}'`;
    const result = await dbConnection.query(query_str);

    return result.rows;
  }


  /**
   * Acquire one user by email address。
   * @param {string} email
   * @return {UserModel|null}
   */
  static async getByEmail(email) {
    const items = await this._getByEmail(email);
    const models = items.map(item => {
      return this.toModel(item);
    });

    return models;
  }

  /**
* Acquire one user by email address。
* @param {string} email
* @return {Object|null}
*/
  static async _getByEmail(email) {
    const res = await dbConnection.query(`SELECT * FROM users WHERE email='${email}' AND status=1`);

    return res.rows;
  }

  /**
   *Acquire one user with login information。
   * @param {string} email
   * @param {password} password
   * @return {UserModel}
   */
  static async getByLogin(email, password) {
    const items = await this._getByLogin(email, password);
    const models = items.map(item => {
      return this.toModel(item);
    });
    return models;
  }

  /**
   * Acquire one user with login information。
   * @param {string} email
   * @param {password} password
   * @return {Object}
   */
  static async _getByLogin(email, password) {
    const passwordHash = this.hashPassword(password);
    var res = await dbConnection.query(`SELECT * FROM users WHERE email='${email}' AND password='${passwordHash}'`);
    return res.rows;
  }

  /**
   * HashedPassword
   * @param {number} password
   * @return {string} hashedPassword
   */
  static hashPassword(password) {
    let pass = process.env.SALT_KEY + password;
    for (var i = 0; i < 3; i++) {
      pass = Crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
    }
    return pass;
  }

  /**
   * Create instances from record of DynamoDB
   * @param {Object} item
   * @return {UserModel|null}
   */
  static toModel(item) {
    if (!item) return null;

    const params = {
      user_id: item.user_id !== undefined ? item.user_id : null,
      email: item.email !== undefined ? item.email : null,
      password: item.password !== undefined ? item.password : null,
      authStatus: item.status !== undefined ? item.status : null,
      createdAt: item.created_at !== undefined ? item.created_at : null,
      updatedAt: item.updated_at !== undefined ? item.updated_at : null
    };
    return new UserModel(params);
  }

}

UserModel.authStatus = {
  pending: 0,
  verified: 1
};

module.exports = UserModel;
