const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");



/** Related functions for tours. */

class POI {

        /** create POI for loggedIn user
     *
     * {name, type, googleplaces_id, googlemaps_link, adress} => {poi:{name, type, googleplaces_id, googlemaps_link, adress}}
     *
     * 
     **/
        static async createPOI(
            {name, type, googleplaces_id, googlemaps_link, adress}) {
          const duplicateCheck = await db.query(
                `SELECT name, googleplaces_id
                 FROM pois
                 WHERE name = $1 AND googleplaces_id = $2`,
              [name, googleplaces_id],
          );
          // check if tour is already in db
          if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate poi: ${name} for googleplaces_id: ${googleplaces_id}`);
          }
     
          // convert start and enddates to unix timestamp
    
          
          // Insert poi into db
          const result = await db.query(
                `INSERT INTO pois
                 (name,
                  type,
                  googlemaps_link,
                  googleplaces_id,
                  adress
                  )
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, name, type, googleplaces_id, googlemaps_link, adress`,
              [
                name, type, googlemaps_link, googleplaces_id, adress
              ],
          );
      
          const poi = result.rows[0];
      
          return poi;
        }



}

module.exports = POI