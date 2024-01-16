const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");
const unix = require("unix-timestamp")


class Tourstop {


    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/
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

  // get tourstops for given tour_id
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

