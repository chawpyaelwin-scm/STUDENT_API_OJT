'use strict'

const Model = require("../models/authorization");
const Token = require("../models/token");
const AbstractService = require("./abstract");
const Util = require("../utils/util");
const CustomErrors = require("../utils/customErrors");
const CustomError = CustomErrors.CustomError;

class AuthService extends AbstractService {

  /**
   * User authentication with access token
   * @param {Object} params
   */
  static async authenticate(params) {
    try {
      const authorization = Util.getHeader("user_id", params.headers);

      /**
       * Confirm existance of login id in header
       */
      if (authorization == null) {
        throw new CustomError("Please Login first。", 403);
      }

      /**
       * Confirm existance of login procress
       */
      const user_id = await Model.getLoginedId(authorization);
      if (user_id.length <= 0) {
        throw new CustomError("Login user id is not correct。", 403);
      }

      /**
       * Confirm whether a token has been sent
       */
      const accessToken = Util.getAccessToken(params);
      if (!accessToken) {
        throw new CustomError("Please Login with token。", 403);
      }

      /**
       * Confirm existance and type of token.
       */
      const token = await Token.getByTokenString(accessToken);
      if (token.length <= 0) {
        // Not found token.
        throw new CustomError(
          "An access token that does not exist is being sent。", 403);
      }
      // else if (token.tokenType !== Model.Token.tokenTypes.access) {
      //   throw new CustomError("Please send an access token", 403);
      // }
    } catch (error) {
      super.throwCustomError(error, "Certification failed。");
    }
  }

  /**
   * user signup
   * @param {Object} params
   * @return {Object}
   */
  static async signup(params) {
    // try {
      const user = await Model.create(params.body);
      console.log("Signup --->",user);

      return super.success(null, {
        user: user
      });
    // } catch (error) {
    //   return super.failed(error, "An error during signup porcess。");
    // }
  }

  /**
   * Login
   * @param {Object} params
   * @return {Object}
   */
  static async login(params) {
    try {
      const user = await Model.getByLogin(
        params.body.email,
        params.body.password
      );

      if (user.length <= 0) {
        // User not found
        throw new CustomError("Email or password is wrong。", 404);
      } else if (user[0].authStatus !== Model.authStatus.verified) {
        // Email address is not authenticated.
        throw new CustomError(" Email address is not authenticated.", 412);
      }

      /**
       * Save logined id, token
       */
      const tokenString = Util.randomString(64);
      const logined_id = await Model.saveLoginedId(user[0].user_id, user[0].email, tokenString);

      return super.success(null, {
        user: user,
        token: tokenString
      });
    } catch (error) {
      return super.failed(error, "An error occoured while login procressing。");
    }
  }
  /**
* Logout
* @param {Object} params
* @return {null}
*/
  static async logout(params) {
    try {
      const authorization = Util.getHeader("user_id", params.headers);
      const deleteLoginSession = await Model.deleteLoginedId(authorization);

      return super.success(200, {
        deleteLoginSession: deleteLoginSession
      });
    } catch (error) {
      return super.failed(error, " An error occoured while logout procressing.。");
    }
  }

}

module.exports = AuthService;
