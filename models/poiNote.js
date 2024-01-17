const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError.js");



class PoiNote{


// create note
static async createNote(
    poi_id, user_id, note) {

  const duplicateCheck = await db.query(
        `SELECT poi_id, user_id
         FROM poinotes
         WHERE poi_id = $1 AND user_id = $2`,
      [poi_id, user_id],
  );
  // check if tourstop is already in db
  if (duplicateCheck.rows[0]) {
    throw new BadRequestError(`Duplicate poinnote for poi ${poi_id} and user ${user_id}`);
  }
  
  
  // Insert activity into db
  const result = await db.query(
        `INSERT INTO poinotes
         (user_id,
         poi_id,
         note)
         VALUES ($1, $2, $3)
         RETURNING id, poi_id, user_id, note`,
      [
        user_id, poi_id, note
      ],
  );

  const poinote = result.rows[0];

  return poinote;
} 

// get note for given user_id and poi_id
static async getNote(user_id, poi_id) {
    const result = await db.query(
          `SELECT id,
                  user_id,
                  poi_id,
                   note
           FROM poinotes
           WHERE user_id = $1 AND poi_id = $2`,
           [user_id, poi_id]
    );

    if (result.rows.length ==0){
      throw new NotFoundError(`No note for user: ${user_id} and poi: ${poi_id}`)
    }

    return result.rows[0];
  }

  // get note for given poinote_id
static async get(poinote_id) {
    const result = await db.query(
          `SELECT user_id,
                  poi_id,
                   note
           FROM poinotes
           WHERE id = $1`,
           [poinote_id]
    );

    if (result.rows.length ==0){
      throw new NotFoundError(`No poinote for id: ${poi_id}`)
    }

    return result.rows[0];
  }

   // update poinote for given poinote_id
 static async update(poinote_id, data) {
   
    const { setCols, values } = sqlForPartialUpdate(
       data,
        {
          note: "note"
        });
    const poinoteidVarIdx = "$" + (values.length + 1);
  
    const querySql = `UPDATE poinotes
                      SET ${setCols} 
                      WHERE id = ${poinoteidVarIdx} 
                      RETURNING id,
                                poi_id,
                                user_id,
                                note`;
    const result = await db.query(querySql, [...values, poinote_id]);
    const poinote = result.rows[0];
    if (!poinote){throw new NotFoundError(`No poinote: ${poinote_id}`)};
    
    return poinote;
  }




   // delete poinote for given poinote_id
 static async remove(poinote_id) {
    const note = await db.query(`DELETE FROM poinotes
                                    WHERE id = $1  
                                    RETURNING id, poi_id, user_id, note`,
                                    [poinote_id])
    if (!note){throw new NotFoundError(`No poinote: ${poinote_id}`)};
    
    return note.rows[0];
  }

}

module.exports = PoiNote

