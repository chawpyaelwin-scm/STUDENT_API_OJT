'use strict'

const Model = require("../models/student");
const AbstractService = require("./abstract");

class StudentService extends AbstractService {

  /**
   create user
   */
  static async createStudent(params) {
    try {
      const userBody = {
        ...params.body
      };
      const userHeader = {
        ...params.headers
      };
      const student = await Model.create(userBody,userHeader);
      return super.success(null, {
        student: student
      });
    } catch (error) {
      return super.failed(error, 'Failed in creating.');
    }
  }

  /**
   * update Student。
   * @param {Object}
   * @return {Object}
   */
  static async updateStudent(params) {
    try {
      const body = {
        stu_id: params.path.stu_id,
        ...params.body
      };
      const Student = await Model.update(body);
      return super.success(null, {
        Student: Student
      });
    } catch (error) {
      return super.failed(error, 'Update Failed');
    }
  }

  /**
  * get Student
  * @param {Object}
  * @return {Object}
  */
  static async getStudent(params) {
    try {
      const Student = await Model.getById(params.path.stu_id);
      return super.success(null, {
        Student: Student
      });
    } catch (error) {
      return super.failed(error, 'An error occoured in getting student。');
    }
  }

  /**
   * get All Student
   * @param {Object}
   * @return {Object}
   */
  static async getAllStudent(params) {
    try {
      const Students = await Model.getByStudentId();
      return super.success(null, {
        Students: Students
      });
    } catch (error) {
      return super.failed(error, 'Error in getting Student。');
    }
  }

  /**
   * delete student
   * @param {Object}
   * @return {Object}
   */
  static async deleteStudent(params) {
    try {
      const body = {
        stu_id: params.path.stu_id,
        ...params.body
      };
      console.log("&&&&&&",params.path.stu_id);
      const Student = await Model.delete(body);
      console.log("deleteeeeee",Student);
      return super.success(null, {
        Student: Student
      });
    } catch (error) {
      return super.failed(error, 'Student deleting error');
    }
  }
}

module.exports = StudentService;
