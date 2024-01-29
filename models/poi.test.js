"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError, ExpressError } = require("../expressError");
const Poi = require("./pois.js")
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

describe("createPOI", function () {
 
    test("works", async function () {

     const newPoi = {
        name: "Testpoi",
            category: "Food",
            googlemaps_link: "12345.de",
            googleplaces_id: "12345",
            address: "Street"
     }
      const result = await Poi.createPOI(newPoi)
      expect(result).toEqual({
        id: expect.any(Number),
        name: "Testpoi",
        category: "Food",
        googlemaps_link: "12345.de",
        googleplaces_id: "12345",
        address: "Street"
      }
      );

      const result2 = await Poi.get(result.id)

      expect(result2).toEqual(
        {
            id: expect.any(Number),
            name: "Testpoi",
            category: "Food",
            googlemaps_link: "12345.de",
            googleplaces_id: "12345",
            address: "Street"
          }

      )

    });
    test("bad request with dupe", async function () {
        const newPoi = {
            name:"poi1",
                category: "restaurant",
                googlemaps_link: "12345.de",
                googleplaces_id: "abcd",
                address: "Street"
         }
    
      try {
      const result = await Poi.createPOI(newPoi);
      } catch (e) {
        expect(e instanceof BadRequestError).toBeTruthy();
      }
    });
  });


  //************************************ */

describe("findAll", function () {
 
    test("works", async function () {

  
     
      const result = await Poi.findAll()
      expect(result).toEqual([{
        id: expect.any(Number),
        name: "poi1",
        category: "restaurant",
        googlemaps_link: "www.google.de",
        googleplaces_id: "abcd",
        address: "address1"
      },
      {
        id: expect.any(Number),
        name: "poi2",
        category: "restaurant",
        googlemaps_link: "www.google.de",
        googleplaces_id: "abcde",
        address: "address2"
      }]
      );


    });
  });


  describe("get", function () {
 
    test("works", async function () {

      const pois = await Poi.findAll()
      const result = await Poi.get(pois[0].id)
      expect(result).toEqual({
        id: expect.any(Number),
        name: "poi1",
        category: "restaurant",
        googlemaps_link: "www.google.de",
        googleplaces_id: "abcd",
        address: "address1"
      }

      )

    });

    test("doesnt work with unknown id", async function () {
       try{
        const result = await Poi.get(14400)
       }
       catch(e){
        expect(e instanceof NotFoundError).toBeTruthy()
       } 
  })

})



describe("update", function () {
 
    test("works", async function () {

      const pois = await Poi.findAll()
      const result = await Poi.update(pois[0].id, {name: "updated_poi", category: "laundry"} )
      expect(result).toEqual({
        id: expect.any(Number),
        name: "updated_poi",
        category: "laundry",
        googlemaps_link: "www.google.de",
        googleplaces_id: "abcd",
        address: "address1"
      }

      )

    });

    test("doesnt work with unknown id", async function () {
       try{
        const result = await Poi.update(14400, {name: "lol"})
       }
       catch(e){
        expect(e instanceof NotFoundError).toBeTruthy()
       } 
  })

})



describe("remove", function () {
 
    test("works", async function () {

      const pois = await Poi.findAll()
      const result = await Poi.remove(pois[0].id )
      try{
        await Poi.get(pois[0].id)
      }
      catch(e){
        expect(e instanceof NotFoundError).toBeTruthy()
      }

    });

    test("doesnt work with unknown id", async function () {
        try{
            await Poi.remove(122999)
          }
          catch(e){
            expect(e instanceof NotFoundError).toBeTruthy()
          }
  })

})