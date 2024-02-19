const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");
const unix = require("unix-timestamp")


class Tourstop {


   // create Tourstop {tour_id, location_id, date} => {id, tour_id, location_id, date}
static async createTourstop(
    tour_id, location_id, date) {

        //convert Date to timestamp
        const unixdate = unix.fromDate(date)
        
  const duplicateCheck = await db.query(
        `SELECT tour_id
         FROM tourstops
         WHERE tour_id = $1 AND location_id = $2 AND date = $3`,
      [tour_id, location_id, unixdate],
  );
  // check if tourstop is already in db
  if (duplicateCheck.rows[0]) {
    throw new BadRequestError(`Duplicate tourstop for tour ${tour_id} and location ${location_id} on ${date}`);
  }
  
  
  // Insert location into db
  const result = await db.query(
        `INSERT INTO tourstops
         (tour_id,
         location_id, date)
         VALUES ($1, $2, $3)
         RETURNING id, tour_id, location_id, date`,
      [
        tour_id, location_id, unixdate
      ],
  );

  const tourstop = result.rows[0];

  return tourstop;
} 

// get tourstops for given tour_id
    static async get(tour_id) {
        const result = await db.query(
              `SELECT tourstops.id,
                      name,
                      city,
                      tour_id,
                      location_id,
                      date
               FROM tourstops JOIN locations ON tourstops.location_id = locations.id
               WHERE tour_id = $1
               ORDER BY location_id`,
               [tour_id]
        );

        if (result.rows.length ==0){
          throw new NotFoundError(`No tourstops for tour: ${tour_id}`)
        }

        result.rows.forEach((el)=>el.date=unix.toDate(Number(el.date)))

        return result.rows;
      }

  // get full tourstop info for given tourstop_id
  static async getFullData(tourstop_id) {
    const result = await db.query(
          `SELECT tourstops.id,
                  name,
                  country,
                  city,
                  street,
                  housenumber,
                  googleplaces_id,
                  tourstops.tour_id,
                  location_id,
                  tour_id,
                  date,
                  lat,
                  lng
           FROM tourstops JOIN locations ON tourstops.location_id = locations.id
           WHERE tourstops.id = $1
           ORDER BY location_id`,
           [tourstop_id]
    );
 

    if (result.rows.length ==0){
      throw new NotFoundError(`No tourstop for tourstop_id: ${tourstop_id}`)
    }

    result.rows.forEach((el)=>el.date=unix.toDate(Number(el.date)))
    result.rows[0].activities = []
    const activitiesforTS = await db.query(
      `SELECT activities.id AS activity_id,
              pois.id AS poi_id,
              activities.traveltime,
              activities.travelmode,
              name,
              category,
              address,
              googleplaces_id,
              googlemaps_link     
       FROM activities JOIN pois ON activities.poi_id = pois.id
       WHERE tourstop_id = $1
       ORDER BY name`,
       [tourstop_id]
);

activitiesforTS.rows.forEach((el)=>result.rows[0].activities.push(el))

const note = await db.query (`SELECT locationnotes.id,
                                      note 
                              FROM tourstops JOIN locationnotes ON locationnotes.location_id = tourstops.location_id
                              WHERE tourstops.id = $1`,
                              [tourstop_id])
  result.rows[0].location_note = note.rows[0]

    return result.rows[0];
  }

  // get tourstop for given tourstop_id
  static async getbyTourstopId(tourstop_id) {
    const result = await db.query(
          `SELECT id,
                  tour_id,
                  location_id,
                  date
           FROM tourstops
           WHERE id = $1
           ORDER BY location_id`,
           [tourstop_id]
    );

    if (result.rows.length ==0){
      throw new NotFoundError(`No tourstops for tourstop_id: ${tourstop_id}`)
    }

    result.rows.forEach((el)=>el.date=unix.toDate(Number(el.date)))

    return result.rows[0];
  }


 // update tourstop for given tourstop_id
 static async update(tourstop_id, data) {
  data.date = unix.fromDate(data.date)
 
  const { setCols, values } = sqlForPartialUpdate(
     data,
      {
        date: "date"
      });
  const tourstopidVarIdx = "$" + (values.length + 1);

  const querySql = `UPDATE tourstops
                    SET ${setCols} 
                    WHERE id = ${tourstopidVarIdx} 
                    RETURNING id,
                              tour_id,
                              location_id,
                              date`;
  const result = await db.query(querySql, [...values, tourstop_id]);
  const tourstop = result.rows[0];
  if (!tourstop){throw new NotFoundError(`No tourstop: ${tourstop_id}`)};
  
  return tourstop;
}


 // delete tourstop for given tourstop_id
 static async remove(tourstop_id) {
  const tourstop = await db.query(`DELETE FROM tourstops 
                                  WHERE id = $1  
                                  RETURNING tour_id, location_id`,
                                  [tourstop_id])
  if (!tourstop){throw new NotFoundError(`No tourstop: ${tourstop_id}`)};
  
  return tourstop.rows[0];
}





}

module.exports = Tourstop

