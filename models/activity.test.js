"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError, ExpressError } = require("../expressError");
const Poi = require("./pois.js")
const Activity = require("./activity.js")
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


//************************************ */

describe("createActivity", function () {
 
    test("works", async function () {
        const tourstops = await db.query('SELECT id FROM tourstops')
        const pois = await db.query('SELECT id FROM pois')

        const tourstop_id= tourstops.rows[0].id
        const poi_id = pois.rows[0].id
     
      const result = await Activity.createActivity({poi_id: poi_id, tourstop_id:tourstop_id, traveltime: 360, travelmode:"walking"})
      expect(result).toEqual({
        id: expect.any(Number),
        poi_id: poi_id,
        tourstop_id: tourstop_id,
        travelmode: "walking",
        traveltime: 360
      }
      );

    });
    test("bad request with dupe", async function () {
        const tourstops = await db.query('SELECT id FROM tourstops')
        const pois = await db.query('SELECT id FROM pois')

        const tourstop_id= tourstops.rows[0].id
        const poi_id = pois.rows[0].id
    
      try {
        const result = await Activity.createActivity({poi_id: poi_id, tourstop_id:tourstop_id, traveltime: 360, travelmode:"walking"})
      } catch (e) {
        expect(e instanceof BadRequestError).toBeTruthy();
      }
    });
  });




  //************************************ */

describe("getFullData", function () {
 
    test("works", async function () {
        const tourstops = await db.query('SELECT id FROM tourstops')
        const pois = await db.query('SELECT id FROM pois')

        const tourstop_id= tourstops.rows[0].id
        const poi_id = pois.rows[0].id
     
        const result = await Activity.createActivity({poi_id: poi_id, tourstop_id:tourstop_id, traveltime: 360, travelmode:"walking"})
        const activities = await db.query('SELECT id FROM activities')

        const result2 = await Activity.getFullData(activities.rows[0].id)
      expect(result2).toEqual({
        id: expect.any(Number),
        user_id: expect.any(Number),
        tourstop_id: tourstop_id,
        poi_id: poi_id,
        poi_name:"poi1",
        poi_googlemaps_link: "www.google.de",
        poi_googleplaces_id: "abcd",
        poi_address: "address1",
        traveltime: 360,
        poi_category:"restaurant",
        travelmode: "walking",
        location: {name: "Location1", googleplaces_id: expect.any(String), city: "city1" },
        poi_note: undefined
      },
     
      );


    });
    test("doesnt work with invalid id", async function () {
        try{
            const result = await Activity.getFullData(98754)
        }
        catch(e){
            expect(e instanceof NotFoundError).toBeTruthy()
        }
    });
  });


  describe("remove", function () {
 
    test("works", async function () {
        const tourstops = await db.query('SELECT id FROM tourstops')
        const pois = await db.query('SELECT id FROM pois')
        const tourstop_id= tourstops.rows[0].id
        const poi_id = pois.rows[0].id
        const result = await Activity.createActivity({poi_id: poi_id, tourstop_id:tourstop_id, traveltime: 360, travelmode:"walking"})
       
        expect(result).toBeTruthy()

        await Activity.remove(result.id)
        try{
        const result2 = await Activity.getFullData(result.id) 
        }
        catch(e){
            expect(e instanceof NotFoundError).toBeTruthy()
        }
      

    });

    test("does not work with unknown iod", async function () {
       
        try{
        const result2 = await Activity.getFullData(2334444) 
        }
        catch(e){
            expect(e instanceof NotFoundError).toBeTruthy()
        }
    });

})


