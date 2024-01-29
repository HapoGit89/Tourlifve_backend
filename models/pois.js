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
     * {name, category, googleplaces_id, googlemaps_link, adress} => {poi:{name, category, googleplaces_id, googlemaps_link, adress}}
     *
     * 
     **/
        static async createPOI(
            {name, category, googleplaces_id, googlemaps_link, address}) {
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
                  category,
                  googlemaps_link,
                  googleplaces_id,
                  address
                  )
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, name, category, googleplaces_id, googlemaps_link, address`,
              [
                name, category , googlemaps_link, googleplaces_id, address
              ],
          );
      
          const poi = result.rows[0];
      
          return poi;
        }

        static async findAll() {
            const result = await db.query(
                  `SELECT id,
                          name,
                          category,
                          googlemaps_link,
                          googleplaces_id,
                          address
                   FROM pois
                   ORDER BY name`,
            );
          
        
            return result.rows;
          }

          static async get(poi_id) {
            const result = await db.query(
                  `SELECT id,
                          name,
                          category,
                          googlemaps_link,
                          googleplaces_id,
                          address
                   FROM pois
                   WHERE id = $1`,
                   [poi_id]
            );
          
        
            return result.rows[0];
          }


          // update tour for given tour_id
      static async update(poi_id, data) {
       
        const { setCols, values } = sqlForPartialUpdate(
           data,
            {
              name: "name",
              category: "category",
              googlemaps_link: "googlemaps_link",
              googleplaces_id: "googleplaces_id",
              address: "address"
            });
        const poiidVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE pois
                          SET ${setCols} 
                          WHERE id = ${poiidVarIdx} 
                          RETURNING id,
                                    name,
                                    category,
                                    address,
                                    googleplaces_id,
                                    googlemaps_link`;
        const result = await db.query(querySql, [...values, poi_id]);
        const poi = result.rows[0];
        if (!poi) throw new NotFoundError(`No poi: ${poi_id}`);
        
        return poi;
      }


    /** Delete poi given poi_id from database; returns undefined. */
  
    static async remove(poi_id) {
        let result = await db.query(
              `DELETE
               FROM pois
               WHERE id = $1
               RETURNING id`,
            [poi_id],
        );
        const poi = result.rows[0];
    
        if (!poi) throw new NotFoundError(`No poi: ${poi_id}`);
      }
    

}

module.exports = POI