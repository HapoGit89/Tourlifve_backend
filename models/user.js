"use strict";

const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {


  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT id,
                  username,
                  email,
                  image_url
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // get password from seperate table
      const result2 = await db.query(
        `SELECT password
         FROM login
         WHERE user_id = $1`,
      [user.id],
  );
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, result2.rows[0].password);
      
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password, email, image_url }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );
    // check if username is already in db
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
    // hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // Insert userdata into db
    const result = await db.query(
          `INSERT INTO users
           (username,
            email,
            image_url
            )
           VALUES ($1, $2, $3)
           RETURNING id, username, email`,
        [
          username,
          email,
          image_url,
        ],
    );

    const user = result.rows[0];

    // insert password into seperate table
    const result2 = await db.query(
      `INSERT INTO login
       (user_id,
        password
        )
       VALUES ($1, $2)`,
    [
      user.id,
      hashedPassword
    ],
    );
  password = ""

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT username,
                  email,
                  image_url
           FROM users
           ORDER BY username`,
    );
  

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, email, image_url}
   *
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT id,
                  username,
                  email,
                  image_url
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    user.tours = []

    const tourRes = await db.query( `SELECT title, artist FROM tours WHERE user_id = $1`,
  [user.id],
  )

  tourRes.rows.forEach(el=>user.tours.push(el))

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { email, image_url}
   *
   * Returns { username, email, image_url }
   *
   * Throws NotFoundError if not found.
   */

  static async update(username, data) {
    if (data.password) {
      hashed_password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
       data,
        {
          email: "email",
          image_url: "image_url"
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                image_url,
                                email`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
    
    return user;
  }

    /** Update login table with new password
     * 
     * {username, password_old, password_new} => {token}
   */

  static async updatePassword(username, password_old, password_new) {
    // get userdata from user table
    const res1 = await db.query('SELECT * FROM users WHERE username = $1', [username])
    const user = res1.rows[0]
   // get password from login table using id from userdata
    const res2 = await db.query('SELECT password FROM login WHERE user_id = $1', [user.id])

    // check password_old input with hashed password in db
    const isValid = await bcrypt.compare(password_old, res2.rows[0].password);

    if (!isValid){
      throw new UnauthorizedError
    }
    // update password in login table
    const hashes_new_password = await bcrypt.hash(password_new, BCRYPT_WORK_FACTOR);
    await db.query('UPDATE login SET password = $1 WHERE user_id = $2', [hashes_new_password, user.id])
    delete res2.rows
    password_old= ""
    password_new = ""
    return user

  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}


module.exports = User;