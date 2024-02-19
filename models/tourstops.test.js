"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError, ExpressError } = require("../expressError");
const Tour = require("./tours.js");
const Location = require("./location.js")
const Tourstop = require("./tourstop.js")
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const unix = require("unix-timestamp")

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


//************************************ */


describe("createTourstop", function () {
 
    test("works", async function () {

        const tours = await Tour.findAll()
        const tour_id = tours[0].id
        const location = await Location.findAll()
        const location_id = location[0].id

      const result = await Tourstop.createTourstop(tour_id, location_id, "1989-12-12");
      expect(result).toEqual({
        tour_id: tour_id,
        location_id: location_id,
        id: expect.any(Number),
        date: expect.any(String)
      }
      );

    });
    test("bad request with dupe", async function () {
        const tours = await Tour.findAll()
        const tour_id = tours[0].id
        const location = await Location.findAll()
        const location_id = location[0].id
      try {
      const result = await Tourstop.createTourstop(tour_id, location_id, "1989-12-12");
      } catch (e) {
        expect(e instanceof BadRequestError).toBeTruthy();
      }
    });
  });

  describe("get", function () {

  
    test("works", async function () {
        const tours = await db.query(
            'SELECT id FROM tours'
        )
        const id = tours.rows[0].id

        const tourstops = await Tourstop.get(id)

      expect(tourstops).toEqual([
        {   id: expect.any(Number),
            city: expect.any(String),
            date: expect.any(Date),
            tour_id: id,
            name: expect.any(String),
            location_id: expect.any(Number),
          }]
        )
})

test("doesnt work with unknown id", async function () {
    try {


   await Tourstop.get(38882)

    }
    catch(e){
        expect (e instanceof NotFoundError).toBeTruthy()

    }
    
})

  })


  describe("getFullData", function () {

  
    test("works", async function () {
        const tourstops = await db.query(
            'SELECT id FROM tourstops'
        )

        const Details = await Tourstop.getFullData(tourstops.rows[0].id)
        expect(Details).toEqual(
            {  
            activities: [],
            city: "city1",
            country: "Country1",
            date: expect.any(Date),
            googleplaces_id: "abcde",
            housenumber: "1",
            id: tourstops.rows[0].id,
            location_id: expect.any(Number),
            name: "Location1",
            location_note: undefined,
            street: "street1",
            lat: expect.any(Number),
            lng: expect.any(Number),
            tour_id: expect.any(Number),}
        )
      
})

test("doesnt work with unknown id", async function () {
    try {


   await Tourstop.getFullData(388382)

    }
    catch(e){
        expect (e instanceof NotFoundError).toBeTruthy()

    }
    
})

  })



describe("update", function () {

  
  test("works", async function () {

    const tourstop = await db.query('SELECT id FROM tourstops')

    const updated = await Tourstop.update(tourstop.rows[0].id, {date: "1989-06-01"})
    

    expect(updated).toEqual(
        { 
            location_id: expect.any(Number),
            tour_id: expect.any(Number),
            date: "612662400",
            id: tourstop.rows[0].id

          }
      
    );

  })

  test("doesnt work with unknown id", async function () {
      try {
        const updated = await Tourstop.update(329009, {date: "1989-06-01"})
      }
      catch(e){
          expect(e instanceof NotFoundError).toBeTruthy()
      }
  })


  test("doesnt work with bad data format", async function () {
    try {
        const tourstop = await db.query('SELECT id FROM tourstops')
      const updated = await Tourstop.update(tourstop.rows[0].id, {date: "19893-06-01"})
    }
    catch(e){
        expect(e instanceof BadRequestError).toBeTruthy()
    }
})

  
})



describe("remove", function () {

  
  test("works", async function () {
    const tourstop = await db.query('SELECT id FROM tourstops')
    await Tourstop.remove(tourstop.rows[0].id)
    try{
        const result = await Tourstop.getFullData(tourstop.rows[0].id)
    }
    catch (e){
        expect ( e instanceof NotFoundError).toBeTruthy()
    }

  })

  test("doesnt work with unknown id", async function () {
      try {
          const tourstop = await Tourstop.remove(12982)
      }
      catch(e){
          expect(e instanceof NotFoundError).toBeTruthy()
      }
 

    })

})