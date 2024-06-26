const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const Tourstop = require("./tourstop.js")
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
        {title, startdate, enddate, user_id, artist }) {
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
 
      // convert start and enddates to unix timestamp and check if tour is in the past

      const endunix = unix.fromDate(enddate)
      const startunix = unix.fromDate(startdate)
      const now = Date.now()/1000
      
      if (endunix < now){
        throw new BadRequestError("Tour in the past")
      }
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
             RETURNING id, title, startdate, enddate, user_id, artist`,
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
      // get tour for given tour_id
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

      

        if (result.rows.length ==0){
          throw new NotFoundError(`No tour: ${tour_id}`)
        }
        result.rows[0].startdate = unix.toDate(Number(result.rows[0].startdate))
        result.rows[0].enddate = unix.toDate(Number(result.rows[0].enddate))
        
        return result.rows[0];
      }
  
      // update tour for given tour_id
      static async update(tour_id, data) {
     
      
        if(data.enddate)  {data.enddate = unix.fromDate(data.enddate)}
        if(data.startdate){data.startdate= unix.fromDate(data.startdate)}

        // check if new tour start/enddate collides with existing tourdates
        const tourdates = await Tourstop.get(tour_id)

        if (tourdates.length >0){
        const firstdate = unix.fromDate(tourdates[0].date)
        const lastdate = unix.fromDate(tourdates[tourdates.length-1].date)

       if (data.enddate < lastdate) throw new BadRequestError("Please enter a new enddate AFTER the last tourstop")
       if (data.startdate > firstdate) throw new BadRequestError("Please enter a new startdate BEFORE the first tourstop")
        }
        //

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
        if (!tour) throw new NotFoundError(`No tour: ${tour_id}`);
        
        return tour;
      }

  
    /** Delete given tour from database; returns undefined. */
  
    static async remove(tour_id) {
      let result = await db.query(
            `DELETE
             FROM tours
             WHERE id = $1
             RETURNING id`,
          [tour_id],
      );
      const tour = result.rows[0];
  
      if (!tour) throw new NotFoundError(`No tour: ${tour_id}`);
    }
  }
  
  
  module.exports = Tour;