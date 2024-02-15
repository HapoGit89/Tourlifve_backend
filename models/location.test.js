"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError, ExpressError } = require("../expressError");
const Tour = require("./tours.js");
const Location = require("./location.js")
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


describe("createLocation", function () {

  
    test("works", async function () {

        const newLocation = {
            name: "Testlocation",
            country: "Testcountry",
            city: "Testcity",
            postal_code:"55435",
            street: "teststreet",
            housenumber: "15",
            googleplaces_id:"blahblah",
            lat: 8.0,
            lng:8.0
          };
     
    
      const result = await Location.createLocation(newLocation);
      expect(result).toEqual(
        {   id: expect.any(Number),
            name: "Testlocation",
            country: "Testcountry",
            city: "Testcity",
            postal_code:"55435",
            street: "teststreet",
            housenumber: "15",
            googleplaces_id:"blahblah",
            lat: 8.0,
            lng:8.0
          
          },
      );

    });
  
    test("bad request with dupe", async function () {
      try {
        const newLocation = {
            name: "Testlocation",
            country: "Testcountry",
            city: "Testcity",
            postal_code:"55435",
            street: "teststreet",
            housenumber: "15",
            googleplaces_id:"blahblah",
            lat: 8.0,
            lng:8.0
          };
     
    
      const result = await Location.createLocation(newLocation);
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });

  describe("findAll", function () {

  
    test("works", async function () {
        const locations = await Location.findAll()

      expect(locations).toEqual([
        {   id: expect.any(Number),
            name: "Location1",
            country: "Country1",
            city: "city1",
            postal_code:"55434",
            street: "street1",
            housenumber: "1",
            googleplaces_id:"abcde",
            lat: 8.0,
            lng:42.0
          },
          { id: expect.any(Number),
            name: "Location2",
            country: "Country2",
            city: "city2",
            postal_code:"55435",
            street: "street2",
            housenumber: "2",
            googleplaces_id:"abcde",
            lat: 9.0,
            lng:42.0
          }]
      );

    })
})

describe("get", function () {

  
    test("works", async function () {
        const locations = await Location.findAll()
        const id = locations[0].id
        const location= await Location.get(id)

      expect(location).toEqual(
        { 
            name: "Location1",
            country: "Country1",
            city: "city1",
            postal_code:"55434",
            street: "street1",
            housenumber: "1",
            googleplaces_id:"abcde",
            lat: 8.0,
            lng:42.0
          }
        
      );

    })

    test("doesnt work with unknown id", async function () {
        try {
            const tour = await Location.get(12989)
        }
        catch(e){
            expect(e instanceof NotFoundError).toBeTruthy()
        }
    })
})



describe("update", function () {

  
  test("works", async function () {
      const locations = await Location.findAll()
      const id = locations[0].id
     const location = await Location.update(id, {name: "LOlocation"})

    expect(location).toEqual(
        { 
            name: "LOlocation",
            country: "Country1",
            city: "city1",
            postal_code:"55434",
            street: "street1",
            housenumber: "1",
            googleplaces_id:"abcde",
            lat: 8.0,
            lng:42.0
          }
      
    );

  })

  test("doesnt work with unknown id", async function () {
      try {
          const locationnoteidVarIdx = await Location.update(13298, {name: "updated_location"})
      }
      catch(e){
          expect(e instanceof NotFoundError).toBeTruthy()
      }
  })

  
})



describe("remove", function () {

  
  test("works", async function () {
      const locations = await Location.findAll()
      const id = locations[0].id
     const tour = await Location.remove(id)
     try {
     const locationsearch = await Location.get(id)}
     catch (e){
      expect(e instanceof NotFoundError).toBeTruthy()
     }


  })

  test("doesnt work with unknown id", async function () {
      try {
          const location = await Location.remove(1298)
      }
      catch(e){
          expect(e instanceof NotFoundError).toBeTruthy()
      }
  })

  
})