"use strict";

const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class Location {


    /** create Location 
     *
     * {name, country, city, postal_code, street, number, googleplaces_id, lat, lng} => {location: {name, country, city, postal_code, street, number, googleplaces_id}}
     *
     * Throws UnauthorizedError if User is not logged in
     **/
    static async createLocation(
        {name, country, city, postal_code, street, housenumber, googleplaces_id, lat, lng}) {
      const duplicateCheck = await db.query(
            `SELECT name
             FROM locations
             WHERE name = $1 AND googleplaces_id = $2`,
          [name, googleplaces_id],
      );
      // check if location is already in db
      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate location: ${name} with googleplaces_id: ${googleplaces_id}`);
      }
 
      // Insert location into db
      const result = await db.query(
            `INSERT INTO locations
             (name,
              country,
              city,
              postal_code,
              street,
              housenumber,
              googleplaces_id,
              lat,
              lng
              )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING name, country, city, postal_code, street, housenumber, googleplaces_id, lat, lng`,
          [
            name, country, city, postal_code, street, housenumber, googleplaces_id, lat, lng
          ],
      );
  
      const location = result.rows[0];
  
      return location;
    }

      /** Find all locations.
   *
   * Returns [{ name, country, city, street, postal_code, number, googleplaces_id}, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  name,
                  country,
                  city,
                  postal_code,
                  street,
                  housenumber,
                  googleplaces_id,
                  lat,
                  lng     
           FROM locations
           ORDER BY name`,
    );
   
    

    return result.rows;
  }

        // get location for given location_id
        static async get(location_id) {
            const result = await db.query(
                  `SELECT name,
                        country,
                        city,
                        postal_code,
                        street,
                        housenumber,
                        googleplaces_id,
                        lat,
                        lng    
                   FROM locations
                   WHERE id = $1`,
                   [location_id]
            );
    
            if (result.rows.length == 0){
              throw new NotFoundError(`No location: ${location_id}`)
            }
            return result.rows[0];
          }

     // update location for given location_id
     static async update(location_id, data) {
     
        const { setCols, values } = sqlForPartialUpdate(
           data,
            {
              name: "name",
              country: "country",
              city: "city",
              street: "street",
              postal_code: "postal_code",
              housenumber: "housenumber"
            });
        const locationidVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE locations
                          SET ${setCols} 
                          WHERE id = ${locationidVarIdx} 
                          RETURNING name,
                                    country,
                                    city,
                                    street,
                                    postal_code,
                                    housenumber,
                                    googleplaces_id,
                                    lat,
                                    lng`;
        const result = await db.query(querySql, [...values, location_id]);
        const location= result.rows[0];
        if (!location) throw new NotFoundError(`No location: ${location_id}`);
        
        return location;
      }

          /** Delete given tour from database; returns undefined. */
  
    static async remove(location_id) {
        let result = await db.query(
              `DELETE
               FROM locations
               WHERE id = $1
               RETURNING id`,
            [location_id],
        );
        const location = result.rows[0];
    
        if (!location) throw new NotFoundError(`No location: ${location_id}`);
      }
    

}


module.exports = Location;