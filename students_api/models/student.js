'use strict';
const AbstractModel = require('./abstract');
const moment = require('moment');
const CustomErrors = require("../utils/customErrors");
const CustomError = CustomErrors.CustomError;
const Util = require("../utils/util");
const pg = require('pg');
const client = new pg.Client(process.env.POSTGRES);
const con = process.env.IS_LOCAL ? client : client;

if (con.connect()) {
  console.log("SUCCESS");
} else {
  console.log("Failed");
}

class StudentModel extends AbstractModel {

  constructor(params = {}) {
    super();
    this.stu_id = params.stu_id;
    this.name = params.name;
    this.age = params.age;
    this.roll_no = params.roll_no;
    this.address = params.address;
    this.class_id = params.class_id;
    this.class_name = params.class_name;
  }

  static async create(params,parmsHeader) {
    const stu_id = params.stu_id;
    const name = params.name;
    const age = params.age;
    const roll_no = params.roll_no;
    const address = params.address;
    const class_id = params.class_id;
    const class_name = params.class_name;
    const itemParams = {
      stu_id: stu_id,
      name: name,
      age: age,
      roll_no: roll_no,
      address: address,
      class_id: class_id,
      class_name: class_name
    }
    const user_id = Util.getHeader("user_id", parmsHeader);
    var sql_str = `select * from students where stu_id = '${stu_id}'`;
    const students = await con.query(sql_str);
    const stulist = `INSERT INTO students (stu_id, name, age, roll_no, address, class_id,created_by) VALUES ('${stu_id}', '${name}', '${age}', '${roll_no}', '${address}', '${class_id}', '${user_id}')`;

    if (students.rows.length>0) {
      console.log("ERROR---------------");
      throw new CustomError('Duplicate stu_id.');
    } else {
      const result =  con.query(stulist);
      if (result) {
        console.log("INSERT SUCCESSFULY");
      } else {
        console.log("INSERTING FAIL");
      }
      return this.toModel(itemParams);
    }
  }

  /**
   * Update Student
   * @param {Object} params Input Parameters
   * @return {StudentModel}
   */
  static async update(params) {
    const stu_id = params.stu_id;
    const name = params.name;
    const age = params.age;
    const roll_no = params.roll_no;
    const address = params.address;
    const class_id = params.class_id;
    const class_name = params.class_name;
    const itemParams = {
      stu_id: stu_id,
      name: name,
      age: age,
      roll_no: roll_no,
      address: address,
      class_id: class_id,
      class_name: class_name
    }
      if(params.name || params.age || params.roll_no || params.address || params.class_id !=null){
      const queyr_str = `UPDATE students SET name='${name}', age='${age}',roll_no='${roll_no}', address='${address}', class_id = '${class_id}'
      WHERE stu_id = '${stu_id}'`;

    const result = con.query(queyr_str);
    if (result) {
    console.log("UPDATE SUCCESSFULY");
    } else {
    console.log("UPDATING FAIL");
    }
    return this.toModel(itemParams);

    }
    else{
      console.log("UPDATING FAIL----------");
      throw new CustomError('Updated Failed',404);
    }
  }

  /**
   * Acquire one Student by student_id.
   * @param {string}  Student student_id
   * @return {StudentModel|null}
   */
  static async getById(stu_id) {
    const item = await this._getById(stu_id);
    return this.toModel(item);
  }

  /**
   * Acquire one Student by student_id.
   * @param {string} age Student student_id
   * @return {Object|null}
   */
  static async _getById(stu_id) {
    var res = await con.query(`SELECT *
        FROM students
        JOIN class ON students.class_id =  class.id
        WHERE students.stu_id ='${stu_id}'`);
    return res.rows[0];
  }

  /**
   * Acquire multiple Studendts with user student_id.
   * @return {Array.<StudentModel>}
   */
  static async getByStudentId() {
    const items = await this._getByStudentId();
    const models = items.map(item => {
      return this.toModel(item);
    });
    return models;
  }

  /**
   * Acquire multiple Students with user student_id.
   * @param {string} userstudent_id ユーザーstudent_id
   * @return {Array.<Object>|null}
   */
  static async _getByStudentId() {
    var res = await con.query(
      "SELECT * FROM students INNER JOIN class ON (students.class_id = class.id)");
    return res.rows;

  }

  /**
   * Delete one Student.
   *
   * @param {string} age Student student_id
   * @return {StudentModel}
   */
  static async delete(params) {
    var res = await con.query(`DELETE from students WHERE stu_id='${params.stu_id}'
        AND class_id IN (SELECT id
                             FROM   class
                             WHERE  id = '${params.class_id}')`);
    console.log("pppppppppppppppp", res);
    return new StudentModel(res);
  }

  /**
   * Create instances from PostgresSQL records.
   * @param {Object} item
   * @return {StudentModel|null}
   */
  static toModel(item) {
    if (!item) return null;
    const params = {
      stu_id: item.stu_id !== undefined ? item.stu_id : null,
      name: item.name !== undefined ? item.name : null,
      age: item.age !== undefined ? item.age : null,
      roll_no: item.roll_no !== undefined ? item.roll_no : null,
      address: item.address !== undefined ? item.address : null,
      class_id: item.class_id !== undefined ? item.class_id : null,
      class_name: item.class_name !== undefined ? item.class_name : null
    };
    return new StudentModel(params);
  }
}

module.exports = StudentModel;
