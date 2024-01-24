const bcrypt = require("bcrypt");

const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const unix = require("unix-timestamp")

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM locations");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM tours");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM pois");
// noinspection SqlWithoutWhere
 

  
  const users=await db.query(`
        INSERT INTO users(username,
                          email,
                          isAdmin)
        VALUES ('u1', 'u1@email.com', false),
               ('u2', 'u2@email.com', true)
        RETURNING id, username, email`,
     );

await db.query(`INSERT INTO login(user_id, password)
                VALUES ($1,$2), ($3, $4)`,
                [   users.rows[0].id,
                    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
                    users.rows[1].id,
                    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
                  ])


 
    const tours = await db.query(`
      INSERT INTO tours(title, artist, startdate, enddate, user_id)
      VALUES ('tour2', 'artist2', $1, $2, $3),
             ('tour2', 'artist1', $4, $5, $6 )
             RETURNING id`,
             [unix.fromDate("1989-10-10"), unix.fromDate("1989-10-12"), users.rows[0].id, unix.fromDate("1989-10-20"), unix.fromDate("1989-10-27"), users.rows[1].id]);

    const locations = await db.query(`
    INSERT INTO locations (name,
        country,
        city,
        postal_code,
        street,
        housenumber,
        googleplaces_id,
        lat,
        lng
        )
    VALUES ('Location1', 'Country1', 'city1', '55434', 'street1', '1', 'abcde', 8.0, 42.0),
            ('Location2', 'Country2', 'city2', '55435', 'street2', '2', 'abcde', 9.0, 42.0)
            RETURNING id`
    );

    await db.query(`
    INSERT INTO tourstops
    (tour_id,
    location_id, date)
    VALUES ($1,$2,$3),
    ($4,$5,$6)
    RETURNING id, tour_id, location_id, date`,
    [tours.rows[0].id, locations.rows[0].id,unix.fromDate("1989-10-11"), tours.rows[1].id, locations.rows[1].id, unix.fromDate("1989-10-25")]
    );

   

    await db.query(
        `INSERT INTO pois
         (name,
          category,
          googlemaps_link,
          googleplaces_id,
          address
          )
         VALUES ('poi1', 'restaurant', 'www.google.de', 'abcd', 'adress1'),
         ('poi2', 'restaurant', 'www.google.de', 'abcde', 'adress2')`
  );


}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};