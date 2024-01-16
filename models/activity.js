const db = require("../db.js");
const {sqlForPartialUpdate} = require("../helpers/sql.js")
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");



class Activity{


   
static async createActivity(
    {poi_id, tourstop_id}) {

 
  const duplicateCheck = await db.query(
        `SELECT poi_id, tourstop_id
         FROM activities
         WHERE poi_id = $1 AND tourstop_id = $2`,
      [poi_id, tourstop_id],
  );
  // check if tourstop is already in db
  if (duplicateCheck.rows[0]) {
    throw new BadRequestError(`Duplicate activity for tourstop ${tourstop_id} and poi ${poi_id}`);
  }
  
  
  // Insert activity into db
  const result = await db.query(
        `INSERT INTO activities
         (poi_id,
         tourstop_id)
         VALUES ($1, $2)
         RETURNING id, poi_id, tourstop_id`,
      [
        poi_id, tourstop_id
      ],
  );

  const activity = result.rows[0];

  return activity;
} 


static async getFullData(activity_id) {
    const result = await db.query(
          `SELECT activities.id,
                 tourstop_id,
                  poi_id,
                  name,
                  category,
                  googlemaps_link,
                  googleplaces_id,
                  address
           FROM activities JOIN pois ON activities.poi_id = pois.id
           WHERE activities.id = $1`,
           [activity_id]
    );

    if (result.rows.length ==0){
      throw new NotFoundError(`No activity for activity_id: ${activity_id}`)
    }

    return result.rows[0];
  }


}

module.exports = Activity

