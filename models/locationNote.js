const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");



class LocationNote{


// create note
static async createNote(
    location_id, user_id, note) {

  const duplicateCheck = await db.query(
        `SELECT location_id, user_id
         FROM locationnotes
         WHERE location_id = $1 AND user_id = $2`,
      [location_id, user_id],
  );
  // check if tourstop is already in db
  if (duplicateCheck.rows[0]) {
    throw new BadRequestError(`Duplicate locationnote for location ${location_id} and user ${user_id}`);
  }
  
  
  // Insert activity into db
  const result = await db.query(
        `INSERT INTO locationnotes
         (user_id,
         location_id,
         note)
         VALUES ($1, $2, $3)
         RETURNING id, location_id, user_id, note`,
      [
        user_id, location_id, note
      ],
  );

  const locationnote = result.rows[0];

  return locationnote;
} 

// get full date for given activity_id
static async getNote(user_id, location_id) {
    const result = await db.query(
          `SELECT id,
                  user_id,
                  location_id,
                   note
           FROM locationnotes
           WHERE user_id = $1 AND location_id = $2`,
           [user_id, location_id]
    );

    if (result.rows.length ==0){
      throw new NotFoundError(`No note for user: ${user_id} and location: ${location_id}`)
    }

    return result.rows[0];
  }

  // get note for given locationnote_id
static async get(locationnote_id) {
    const result = await db.query(
          `SELECT user_id,
                  location_id,
                   note
           FROM locationnotes
           WHERE id = $1`,
           [locationnote_id]
    );

    if (result.rows.length ==0){
      throw new NotFoundError(`No note for id: ${locationnote_id}`)
    }

    return result.rows[0];
  }

   // update locationnote for given locationnote_id
 static async update(locationnote_id, data) {
   
    const { setCols, values } = sqlForPartialUpdate(
       data,
        {
          note: "note"
        });
    const locationnoteidVarIdx = "$" + (values.length + 1);
  
    const querySql = `UPDATE locationnotes
                      SET ${setCols} 
                      WHERE id = ${locationnoteidVarIdx} 
                      RETURNING id,
                                location_id,
                                user_id,
                                note`;
    const result = await db.query(querySql, [...values, locationnote_id]);
    const locationnote = result.rows[0];
    if (!locationnote){throw new NotFoundError(`No locationnote: ${locationnote_id}`)};
    
    return locationnote;
  }




   // delete locationnote for given locationnote_id
 static async remove(locationnote_id) {
    const note = await db.query(`DELETE FROM locationnotes
                                    WHERE id = $1  
                                    RETURNING id, location_id, user_id, note`,
                                    [locationnote_id])
    if (!note){throw new NotFoundError(`No locationnote: ${locationnote_id}`)};
    
    return note.rows[0];
  }

}

module.exports = LocationNote

