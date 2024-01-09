const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const bcrypt = require("bcrypt");
const unix = require("unix-timestamp")
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");



/** Related functions for tours. */

class Tour {


    /** create Tour for loggedIn user
     *
     * {title, crew, start, end, user_id, artist} => {id, title, crew, start, end, user_id, artist}
     *
     * Throws UnauthorizedError if user_id is not corresponding to token
     **/
    static async createTour(
        {title, crew, start, end, user_id, artist }) {
      const duplicateCheck = await db.query(
            `SELECT title, user_id
             FROM tours
             WHERE title = $1 AND user_id = $2`,
          [title, user_id],
      );
      // check if tour is already in db
      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate tour: ${title} for user : ${user_id}`);
      }
 
      // convert start and enddates to unix timestamp

      const endunix = unix.fromDate(end)
      const startunix = unix.fromDate(start)
      // Insert tourdata into db
      const result = await db.query(
            `INSERT INTO tours
             (title,
              startdate,
              enddate,
              user_id,
              artist
              )
             VALUES ($1, $2, $3, $4, $5)
             RETURNING title, startdate, enddate, user_id, artist`,
          [
            title, startunix, endunix, user_id, artist
          ],
      );
  
      const tour = result.rows[0];
  
      return tour;
    }

  // Find all tours 
    static async findAll() {
        const result = await db.query(
              `SELECT id,
                      title,
                      artist,
                      startdate,
                      enddate,
                      user_id
               FROM tours
               ORDER BY user_id`,
        );
      
          result.rows.forEach((el)=>el.startdate=unix.toDate(Number(el.startdate)))
          result.rows.forEach((el)=>el.enddate=unix.toDate(Number(el.enddate)))
        return result.rows;
      }

    static async get(tour_id) {
        const result = await db.query(
              `SELECT title,
                      artist,
                      startdate,
                      enddate,
                      user_id
               FROM tours
               WHERE id = $1
               ORDER BY user_id`,
               [tour_id]
        );
      
    
        return result.rows;
      }


      static async update(tour_id, data) {

        data.end = unix.fromDate(data.end)
        data.start= unix.fromDate(data.start)
    
        const { setCols, values } = sqlForPartialUpdate(
           data,
            {
              title: "title",
              artist: "artist",
              start: "startdate",
              end: "enddate",
            });
        const touridVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE tours
                          SET ${setCols} 
                          WHERE id = ${touridVarIdx} 
                          RETURNING title,
                                    artist,
                                    startdate,
                                    enddate,
                                    user_id`;
        const result = await db.query(querySql, [...values, tour_id]);
        const tour = result.rows[0];
        if (!tour) throw new NotFoundError(`No user: ${username}`);
        
        return tour;
      }



  
    /** Delete given user from database; returns undefined. */
  
  //   static async remove(username) {
  //     let result = await db.query(
  //           `DELETE
  //            FROM users
  //            WHERE username = $1
  //            RETURNING username`,
  //         [username],
  //     );
  //     const user = result.rows[0];
  
  //     if (!user) throw new NotFoundError(`No tou`);
  //   }
  }
  
  
  module.exports = Tour;