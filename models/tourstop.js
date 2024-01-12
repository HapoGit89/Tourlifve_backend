const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");


class Tourstop {


    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/
static async createTourstop(
    {tour_id, location_id}) {
  const duplicateCheck = await db.query(
        `SELECT tour_id
         FROM tourstops
         WHERE tour_id = $1 AND location_id = $2`,
      [tour_id, location_id],
  );
  // check if location is already in db
  if (duplicateCheck.rows[0]) {
    throw new BadRequestError(`Duplicate tourstop for tour ${tour_id} and location ${location_id}`);
  }

  // Insert location into db
  const result = await db.query(
        `INSERT INTO tourstops
         (name,
          country,
          city,
          postal_code,
          street,
          housenumber,
          googleplaces_id
          )
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING name, country, city, postal_code, street, housenumber, googleplaces_id`,
      [
        name, country, city, postal_code, street, number, googleplaces_id
      ],
  );

  const location = result.rows[0];

  return location;
} }

module.exports = Tourstop

