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

        const tourstop = await Tourstop.get(id)

      expect(tourstop).toEqual([
        {   id: expect.any(Number),
            city: expect.any(String),
            date: expect.any(Date),
            tour_id: id,
            name: expect.any(String),
            location_id: expect.any(Number),
          }]
        )
})

  })

// describe("get", function () {

  
//     test("works", async function () {
//         const locations = await Location.findAll()
//         const id = locations[0].id
//         const location= await Location.get(id)

//       expect(location).toEqual(
//         { 
//             name: "Location1",
//             country: "Country1",
//             city: "city1",
//             postal_code:"55434",
//             street: "street1",
//             housenumber: "1",
//             googleplaces_id:"abcde",
//             lat: 8.0,
//             lng:42.0
//           }
        
//       );

//     })

//     test("doesnt work with unknown id", async function () {
//         try {
//             const tour = await Location.get(12989)
//         }
//         catch(e){
//             expect(e instanceof NotFoundError).toBeTruthy()
//         }
//     })
// })



// describe("update", function () {

  
//   test("works", async function () {
//       const locations = await Location.findAll()
//       const id = locations[0].id
//      const location = await Location.update(id, {name: "LOlocation"})

//     expect(location).toEqual(
//         { 
//             name: "LOlocation",
//             country: "Country1",
//             city: "city1",
//             postal_code:"55434",
//             street: "street1",
//             housenumber: "1",
//             googleplaces_id:"abcde",
//             lat: 8.0,
//             lng:42.0
//           }
      
//     );

//   })

//   test("doesnt work with unknown id", async function () {
//       try {
//           const locationnoteidVarIdx = await Location.update(13298, {name: "updated_location"})
//       }
//       catch(e){
//           expect(e instanceof NotFoundError).toBeTruthy()
//       }
//   })

  
// })



// describe("remove", function () {

  
//   test("works", async function () {
//       const locations = await Location.findAll()
//       const id = locations[0].id
//      const tour = await Location.remove(id)
//      try {
//      const locationsearch = await Location.get(id)}
//      catch (e){
//       expect(e instanceof NotFoundError).toBeTruthy()
//      }


//   })

//   test("doesnt work with unknown id", async function () {
//       try {
//           const location = await Location.remove(1298)
//       }
//       catch(e){
//           expect(e instanceof NotFoundError).toBeTruthy()
//       }
//  